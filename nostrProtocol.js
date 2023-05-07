import {
  signEvent,
  getEventHash,
  relayInit
} from 'nostr-tools'
import 'websocket-polyfill'

const PRIVATE_KEY = process.env.PRIVATE_KEY
const PUB_KEY = 'c8c4d65e191a58054907c1596bfd793f5a02a24efdf477fc7634d0de45d6cb4a'
const RELAY_SERVER_URL = "wss://relay.nekolicio.us/"

let event = {
  kind: 1, // text_note
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hello from Tokyo',
  pubkey: PUB_KEY
}

event.id = getEventHash(event)
event.sig = signEvent(event, PRIVATE_KEY)

const relay = relayInit(RELAY_SERVER_URL)
relay.on('connect', () => {
  console.log(`connected to ${relay.url}`)
})
relay.on('error', () => {
  console.log(`failed to connect to ${relay.url}`)
})

await relay.connect()

setTimeout(() => {
  relay.close();
  console.log('connection closed');
}, 5000);
