import WebSocket from 'ws'
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  signEvent,
  getEventHash,
} from 'nostr-tools'
import 'websocket-polyfill'

const ws = new WebSocket("ws://localhost:8080")
const SUBSCRIPTION_ID = "12j312n31knkajsndaksndas";

const PRIVATE_KEY = process.env.PRIVATE_KEY
const PUB_KEY = 'c8c4d65e191a58054907c1596bfd793f5a02a24efdf477fc7634d0de45d6cb4a'

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
});

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
  // const req = JSON.stringify(['REQ', SUBSCRIPTION_ID])
  // ws.send(req);
  // console.log("Your sent request: ", req)

  const myEvent = JSON.stringify(['EVENT', event])
  ws.send(myEvent);
  console.log("Your sent event: ", myEvent)
};

setTimeout(() => {
  ws.close()
  console.log('connection closed')
}, 10000)

ws.onclose = function(event) {
  const req = JSON.stringify(['CLOSE', '12j312n31knkajsndaksndas'])
  ws.send(req);
  console.log("Your unsubscribed: ", req)
};
