#!/usr/bin/env node

const fs            = require('fs')
const Twit          = require('twit')
const async         = require('async')
const phantom       = require('phantom')
const minimist      = require('minimist')
const Mustache      = require('mustache')
const {WikiChanges} = require('wikichanges')
const configFile = require('./config.js')

const argv = minimist(process.argv.slice(2), {
  default: {
    verbose: false
  }
})

function loadJson(path) {
  if ((path[0] !== '/') && (path.slice(0, 2) !== './')) {
    path = `./${path}`
  }
  return require(path)
}

function getStatusLength(edit, template) {
  // https://support.twitter.com/articles/78124-posting-links-in-a-tweet
  const fakeUrl = 'https://t.co/BzHLWr31Ce'
  const status = Mustache.render(template, {url: fakeUrl, page: edit.page})
  return status.length
}

function getStatus(edit, template) {
  let page = edit.page
  const len = getStatusLength(edit, template)
  if (len > 280) {
    const newLength = edit.page.length - (len - 279)
    page = edit.page.slice(0, +newLength + 1 || undefined)
  }
  return Mustache.render(template, {
    url: edit.url,
    page
  })
}

const lastChange = {}

function isRepeat(edit) {
  const k = `${edit.wikipedia}`
  const v = `${edit.page}:${edit.user}`
  const r = lastChange[k] === v
  lastChange[k] = v
  return r
}

function takeScreenshot(url) {
  return new Promise(function(resolve, reject) {
    phantom.create(['--ignore-ssl-errors=yes']).then(function(browser) {
      var filename = new Date().toString() + '.png'
      browser.createPage().then(function(page) {
        page.property('viewportSize', {width: 1024, height: 768}).then(function() {
          page.open(url).then(function(status) {
            if (status === 'fail') {
              cb('fail', null)
            } else {
              page.evaluate(function() {
                try {
                  var diffBoundingRect = document.querySelector('table.diff.diff-contentalign-left').getBoundingClientRect()
                  // for some reason phantomjs doesn't seem to get the sizing right
                  return {
                    top: diffBoundingRect.top,
                    left: diffBoundingRect.left,
                    width: diffBoundingRect.width + 75,
                    height: diffBoundingRect.height,
                  }
                } catch(e) {
                  console.log('Error: no diff found on wikipedia page')
                }
              }).then(function(clipRect) {
                page.property('clipRect', clipRect).then(function() {
                  page.render(filename).then(function() {
                    browser.exit().then(function() {
                      resolve(filename)
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  })
}

function sendStatus(account, status, edit) {
  console.log('Status:', status)

  if (!argv.noop && (!account.throttle || !isRepeat(edit))) {

    takeScreenshot(edit.url).then(function(screenshot) {

      // Twitter
      if (account.access_token) {
        const twitter = new Twit(account)
        const b64content = fs.readFileSync(screenshot, {encoding: 'base64'})

        // upload the screenshot to twitter
        twitter.post('media/upload', {media_data: b64content}, function(err, data, response) {
          if (err) {
            console.log(err)
            return
          }

          // add alt text for the media, for use by screen readers
          const mediaIdStr = data.media_id_string
          const altText = "Screenshot of edit to " + edit.page
          const metaParams = {media_id: mediaIdStr, alt_text: {text: altText}}

          twitter.post('media/metadata/create', metaParams, function(err, data, response) {
            if (err) {
              console.log('metadata upload for twitter screenshot alt text failed with error', err)
            }
            const params = {
              'status': status,
              'media_ids': [mediaIdStr]
            }
            twitter.post('statuses/update', params, function(err) {
              if (err) {
                console.log(err)
              }
            })
            fs.unlink(screenshot)
            console.log('enviado')
          })
        })
      }

    })
  }
}

function presidentPage(url, pages) {
  const exist = (pages.indexOf(url) > -1)
  return exist
}

function inspect(account, edit, pages, lang) {
  if (presidentPage(edit.pageUrl, pages) && edit.wikipediaShort === lang) {
    if (presidentPage(edit.pageUrl, pages)) {
      status = getStatus(edit, account.template)
      sendStatus(account, status, edit)
    }
  }
}

function checkConfig(config, error) {
  if (config.accounts) {
    return async.each(config.accounts, canTweet, error)
  } else {
    return error("missing accounts stanza in config")
  }
}

function canTweet(account, error) {
  if (!account.access_token) {
    error(null)
  } else {
    try {
      const twitter = new Twit(account)
      const a = account['access_token']
      return twitter.get('search/tweets', {q: 'cats'}, function(err, data, response) {
        if (err) {
          error(err + " for access_token " + a)
        } else if (!response.headers['x-access-level'] ||
            (response.headers['x-access-level'].substring(0,10) !== 'read-write')) {
          error(`no read-write permission for access token ${a}`)
        } else {
          error(null)
        }
      })
    } catch (err) {
      error(`unable to create twitter client for account: ${account}`)
    }
  }
}

function main() {
  const config = configFile
  const pages = config.pages.list
  const lang = config.wiki_lang
  return checkConfig(config, function(err) {
    if (!err) {
      const wikipedia = new WikiChanges({ircNickname: config.nick})
      return wikipedia.listen(edit => {
        if (config.verbose) {
          console.log(JSON.stringify(edit))
        }
        Array.from(config.accounts).map((account) =>
          inspect(account, edit, pages, lang))
      })
    } else {
      return console.log(err)
    }
  })
}

if (require.main === module) {
  main()
}

module.exports = {
  main,
  getStatus,
  takeScreenshot
}
