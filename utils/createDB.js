import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'fakeMyKeyId',
  secretAccessKey: 'fakeSecretAccessKey'
});

const params = {
  TableName: 'nostro-aggregator-data-store',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' },
    { AttributeName: 'created_at', KeyType: 'RANGE' }, // Add the attribute definition for created_at
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'created_at', AttributeType: 'N' }, // Add the attribute definition for created_at
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  GlobalSecondaryIndexes: [ // Define the Global Secondary Index
    {
      IndexName: 'created_at_index',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'created_at', KeyType: 'RANGE' }, // Use 'RANGE' as KeyType for the index
      ],
      Projection: {
        ProjectionType: 'ALL', // Adjust the projection type as needed
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
};

dynamoDB.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully:', data);
  }
});
