// Page list
const pages = require('./pages.js')
// Twitter API config
const twitterConfig = require('./twitter.config.js')
const wikichanges = require('wikichanges')
const _ = require('underscore')
const Twit = require('twit')
const T = new Twit(twitterConfig)
const { FIREBASE_URL } = process.env

// Initialize Firebase
var admin = require('firebase-admin')
var serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_URL
})

const db = admin.database()
const ref = db.ref('/')

// Function to Init wikipedia stream
function streamWikipedia () {
  const w = new wikichanges.WikiChanges({wikipedias: ['#pt.wikipedia']})

  w.listen(function (change) {
    if (_.contains(pages.list, change.pageUrl)) {
      const text = `A página "${change.page}" foi editada na Wikipédia. Vejas as mudanças: ${change.pageUrl}`
      tweetToAccount(text)
      // Save modified data on firebase
      let logRef = ref.child('/modified')
      let newLogRef = logRef.push()
      newLogRef.set(change)
    } else {
      // Save data to firebase
      let logRef = ref.child('/log')
      let newLogRef = logRef.push()
      newLogRef.set(change)
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
