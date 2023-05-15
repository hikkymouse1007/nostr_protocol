import {WebSocketServer} from 'ws'
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  verifySignature
} from 'nostr-tools'
import 'websocket-polyfill'

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
});
const server = new WebSocketServer({port: 8080})

server.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const message = JSON.parse(data.toString())

    if (message[0] === 'EVENT' && verifySignature(message[1])){
      storeEventData(message)
    } else {
      console.error('Failed to verify signature');
    }
  })
});


const storeEventData = function(eventMessage) {
  const params = {
    TableName: 'nostro-data-store',
    Item: {
      id: uuidv4(),
      message: eventMessage
    }
  };

  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error('Error storing data:', err);
    } else {
      console.log('Data stored successfully:', data);
    }
  });
}
