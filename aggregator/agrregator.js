import WebSocket from 'ws';
import MessageQueueService from './services/messageQueue.js';
import { v4 as uuidv4 } from 'uuid'


const SUBSCRIPTION_ID = uuidv4();
// const RELAY_ENDPOINTS = ['wss://relay.nekolicio.us/', 'wss://floating-fortress-37708.herokuapp.com'];
const RELAYS = ['wss://relay.nekolicio.us/'];
const queueService = new MessageQueueService(
  process.env.RABBITMQ_ENDPOINT
);
const AGGREGATOR_QUEUE_NAME = 'eventQueue';

(async () => {
  await queueService.connect();

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
        await queueService.publishToQueue(
          AGGREGATOR_QUEUE_NAME,
          JSON.stringify({
            sig: eventData.sig,
            payload: eventData.content,
          })
        );

        console.log('pushed event to queue successfully!');
      }
    });

    ws.on('close', function close() {
      console.log('disconnected from relay');
    });
  });
})();

const cleanup = async () => {
  try {
    // Close the RabbitMQ connection
    await queueService.closeChannel();
    console.log('Closed RabbitMQ connection');
  } catch (err) {
    console.error('Failed to clean up:', err);
    // Handle the error or rethrow it
    throw err;
  }
};

// Register the cleanup function for the exit events
process.on('SIGTERM', () => cleanup().then(() => process.exit()));
process.on('SIGINT', () => cleanup().then(() => process.exit()));
process.on('SIGUSR1', () => cleanup().then(() => process.exit()));
process.on('SIGUSR2', () => cleanup().then(() => process.exit()));

// Register the cleanup function for unhandled exceptions and promise rejections
process.on('uncaughtException', async err => {
  console.error('Unhandled exception:', err);
  try {
    await cleanup();
  } catch (cleanupErr) {
    console.error('Cleanup failed after unhandled exception:', cleanupErr);
  }
  process.exit(1);
});

process.on('unhandledRejection', async err => {
  console.error('Unhandled promise rejection:', err);
  try {
    await cleanup();
  } catch (cleanupErr) {
    console.error(
      'Cleanup failed after unhandled promise rejection:',
      cleanupErr
    );
  }
  process.exit(1);
});
