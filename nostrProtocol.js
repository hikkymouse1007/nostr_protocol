import {
  signEvent,
  getEventHash,
  relayInit
} from 'nostr-tools'
import 'websocket-polyfill'

const PRIVATE_KEY = process.env.PRIVATE_KEY
const PUB_KEY = 'c8c4d65e191a58054907c1596bfd793f5a02a24efdf477fc7634d0de45d6cb4a'
const RELAY_SERVER_URL = "wss://relay.nekolicio.us/"

// Initialize relay connection
const relay = relayInit(RELAY_SERVER_URL)
relay.on('connect', () => {
  console.log(`connected to ${relay.url}`)
})
relay.on('error', () => {
  console.log(`failed to connect to ${relay.url}`)
})

// Connect to the nostr server
await relay.connect()

let sub = relay.sub([
  {
    kinds: [1],
    authors: [PUB_KEY]
  }
])

sub.on('event', event => {
  console.log('got event:', event)
})

let event = {
  kind: 1, // text_note
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Who is online now?',
  pubkey: PUB_KEY
}

event.id = getEventHash(event)
event.sig = signEvent(event, PRIVATE_KEY)


// Send event to relay server
let pub = relay.publish(event)

pub.on('ok', () => {
  console.log(`${relay.url} has accepted our event`)
})
pub.on('failed', reason => {
  console.log(`failed to publish to ${relay.url}: ${reason}`)
})

let events = await relay.list([{kinds: [0, 1]}])
console.log(events)

setTimeout(() => {
  relay.close()
  console.log('connection closed')
}, 5000)
