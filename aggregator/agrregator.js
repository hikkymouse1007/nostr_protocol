import WebSocket from 'ws';
import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid'


const SUBSCRIPTION_ID = uuidv4();
// const RELAY_ENDPOINTS = ['wss://relay.nekolicio.us/', 'wss://floating-fortress-37708.herokuapp.com'];
const RELAYS = ['wss://relay.nekolicio.us/', 'wss://floating-fortress-37708.herokuapp.com'];

RELAYS.forEach(relay => {
  // Connect to relay
  const ws = new WebSocket(relay);

  ws.on('open', function open() {
    console.log('connected to relay');
    ws.send(JSON.stringify(['REQ', SUBSCRIPTION_ID, { Kinds: [1] }]));
  });

  ws.on('message', async function incoming(message) {
    // Parse the message
    const [action, ...args] = JSON.parse(message);

    if (action === 'EVENT') {
      // Store the event in the database
      const eventData = args[1];
      console.log(message)

      console.log('pushed event to queue successfully!');
    }
  });

  ws.on('close', function close() {
    console.log('disconnected from relay');
  });
});
