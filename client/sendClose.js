import WebSocket from 'ws'
import 'websocket-polyfill'
import { v4 as uuidv4 } from 'uuid'

const ws = new WebSocket("ws://localhost:8080")
const SUBSCRIPTION_ID = "bceb56ce-2f33-4bea-851f-1e845a24e04e";

ws.onopen = function(e) {
  const req = JSON.stringify(['CLOSE', SUBSCRIPTION_ID])
  ws.send(req);
  console.log("Your sent CLOSE request: ", req)
};

ws.onmessage = function(e) {
  console.log("Received message from server: ", e.data);
  ws.close()
};


