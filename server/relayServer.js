import {WebSocketServer} from 'ws'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import {
  verifySignature
} from 'nostr-tools'
import 'websocket-polyfill'

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
})
const server = new WebSocketServer({port: 8080})
const subscriptions = {}

server.on('connection', function connection(ws) {
  let subscriptionId;

  ws.on('message', async (data) => {
    try {
      const [action, ...params] = JSON.parse(data)
      switch (action) {
        case 'EVENT':
          const message = params[0]
          if (!verifySignature(message)) {
            throw new Error('Failed to verify signature')
          }

          await storeEventData(message)
          ws.send('ok')

          for (const subId in subscriptions) {
            const client = subscriptions[subId]

            if (client.readyState === WebSocket.OPEN) {
              try {
                client.send(JSON.stringify(message));
                console.log(
                  `Message sent to client with subscriptionId: ${subId}`
                );
              } catch (err) {
                console.error(
                  `Failed to send message to client with subId: ${subId}, error: ${err}`
                );
              }
            }
          }
          break
        case 'REQ':
          subscriptionId = params[0]
          console.log('REQ: from ', subscriptionId)
          subscriptions[subscriptionId] = ws
          break
        case 'CLOSE':
          const closeTargetSubId = params[0];
          if (closeTargetSubId === subscriptionId) {
            subscriptionId = null;

            if (subscriptions[closeTargetSubId]) {
              const client = subscriptions[closeTargetSubId]
              if (client.readyState === WebSocket.OPEN) {
                console.log('CLOSE: ', closeTargetSubId);
                client.send(`unsubscribed: ${closeTargetSubId}`)
              }
              delete subscriptions[closeTargetSubId]
            }
          }

          break
        default:
          throw new Error('Unknown action')
      }
    } catch (error) {
      ws.send('failed')
      console.error(`Failed to process message: ${error}`)
    }
  })
})

const storeEventData = (eventMessage) => {
  const messageItem =  {
    id: eventMessage.id,
    pubkey: eventMessage.pubkey,
    created_at: new Date(eventMessage.created_at).toISOString(),
    content: eventMessage.content,
    sig: eventMessage.sig
  }
  console.log(messageItem)

  const params = {
    TableName: 'nostro-data-store',
    Item: messageItem
  }

  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error('Error storing data:', err)
    } else {
      console.log('Data stored successfully:', data)
    }
  })
}

