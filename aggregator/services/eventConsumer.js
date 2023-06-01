import AWS from 'aws-sdk'
import 'websocket-polyfill'

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
})

import MessageQueueService from './messageQueue.js';

const queueService = new MessageQueueService(
  process.env.RABBITMQ_ENDPOINT
);
const AGGREGATOR_QUEUE_NAME = 'eventQueue';

(async () => {
  // Connect to RabbitMQ
  await queueService.connect();
  console.log('Connect to queue service successfully, waiting for event...');

  // Fetch events from the queue and store them in the database
  queueService.channel.consume(AGGREGATOR_QUEUE_NAME, async msg => {
    try {
      const eventData = JSON.parse(msg.content.toString());
      console.log('eventData consumed from MQ...', eventData);

      await storeEventData(eventData)

      // await prisma.aggregation_Event.create({
      //   data: {
      //     sig: eventData.sig,
      //     payload: eventData.payload,
      //   },
      // });
      // console.log('stored event to DB successfully!');

      // // Acknowledge the message
      // queueService.channel.ack(msg);
    } catch (err) {
      console.error(`Error occurred: ${err.message}`);
      // In case of an error, reject the message
      queueService.channel.nack(msg);
    }
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


const storeEventData = (eventData) => {
  console.log(eventData)

  const item =  {
    id: eventData.id,
    pubkey: eventData.pubkey,
    created_at: eventData.created_at,
    content: eventData.content,
    sig: eventData.sig
  }

  const params = {
    TableName: 'nostro-data-store',
    Item: item
  }

  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error('Error storing data:', err)
    } else {
      console.log('Data stored successfully:', data)
    }
  })
}
