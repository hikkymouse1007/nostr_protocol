import WebSocket from 'ws'
import 'websocket-polyfill'
import { v4 as uuidv4 } from 'uuid'

const ws = new WebSocket("wss://floating-fortress-37708.herokuapp.com")
const SUBSCRIPTION_ID = uuidv4();

ws.onopen = function(e) {
  const req = JSON.stringify(['REQ', SUBSCRIPTION_ID])
  ws.send(req);
  console.log("Your sent request: ", req)
};

ws.onmessage = function(e) {
  console.log("Received message from server: ", e.data);
};

setTimeout(() => {
  const req = JSON.stringify(['CLOSE', SUBSCRIPTION_ID])
  ws.send(req);
  console.log("Your sent CLOSE request: ", req)

  ws.close()
  console.log('connection closed')
}, 10000)
