import WebSocket from 'ws'
import {
  signEvent,
  getEventHash,
} from 'nostr-tools'
import 'websocket-polyfill'

const ws = new WebSocket("wss://floating-fortress-37708.herokuapp.com")

const SUBSCRIPTION_ID = "12j312n31knkajsndaksndas";

const PRIVATE_KEY = '402d72ee0fffc89444c095640fc4a93b33876fb14e1783cb64cf870b120218c2'
const PUB_KEY = 'c570d91160e4fa61d353434e2ef80c0cc4d4700e39cad0b6187f5d2f568d2efa'

let event = {
  kind: 1, // text_note
  created_at: Date.now(),
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
  const req = JSON.stringify(['CLOSE', SUBSCRIPTION_ID])
  ws.send(req);
  console.log("Your sent CLOSE request: ", req)

  ws.close()
  console.log('connection closed')
}, 10000)
