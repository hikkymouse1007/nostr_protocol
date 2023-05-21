import WebSocket from 'ws'
import {
  signEvent,
  getEventHash,
} from 'nostr-tools'
import 'websocket-polyfill'

const ws = new WebSocket("ws://localhost:8080")
const SUBSCRIPTION_ID = "12j312n31knkajsndaksndas";

const PRIVATE_KEY = process.env.PRIVATE_KEY
const PUB_KEY = 'c8c4d65e191a58054907c1596bfd793f5a02a24efdf477fc7634d0de45d6cb4a'

let event = {
  kind: 1, // text_note
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Yay! You\'re on Rails!',
  pubkey: PUB_KEY
}

event.id = getEventHash(event)
event.sig = signEvent(event, PRIVATE_KEY)

ws.onopen = function(e) {
  const myEvent = JSON.stringify(['EVENT', event])
  ws.send(myEvent);
  console.log("Your sent event: ", myEvent)
};

ws.onmessage = function(e) {
  console.log("Received message from server: ", e.data);
  console.log(`${ws.url} has accepted your event`);
  // You can perform any further processing or checks on the received message here
};

setTimeout(() => {
  ws.close()
  console.log('connection closed')
}, 10000)
