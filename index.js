// Page list
const pages = require('./pages.js')
// Twitter API config
const twitterConfig = require('./twitter.config.js')

const wikichanges = require('wikichanges')
const _ = require('underscore')
const Twit = require('twit')
const T = new Twit(twitterConfig)

// Function to Init wikipedia stream
function streamWikipedia () {
  const w = new wikichanges.WikiChanges({wikipedias: ['#pt.wikipedia']})

  w.listen(function (change) {
    if (_.contains(pages.list, change.pageUrl)) {
      const text = `A página "${change.page}" foi editada na Wikipédia. Vejas as mudanças: ${change.pageUrl}`
      tweetToAccount(text)
    } else {
      console.log(change)
    }
  })
}
// Init wikipedia stream
streamWikipedia()

// Tweet to account
function tweetToAccount (status) {
  T.post('statuses/update', { status }, function (err, data, response) {
    if (err) {
      console.log(err)
      return false
    }
    console.log(data)
  })
}

// To-Do info page
module.exports = (req, res) => {
  res.end('Nada aqui. o/')
}
