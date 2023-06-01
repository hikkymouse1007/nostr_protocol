import AWS from 'aws-sdk'

class DBClient {
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:8000',
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey'
    })
  }

  async fetchAllData() {
    const params = {
      TableName: 'nostro-data-store',
    }
    this.docClient.scan(params, function(err, data){
      if(err){
          console.log(err);
      }else{
         data.Items.forEach(function(item, _){
             console.log(item);
         });
      }
    });
  }

  async fetchLatestData() {
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    const ago = currentTime - 30; // Calculate timestamp 30 sec ago

    const params = {
      TableName: 'nostro-data-store',
      ExpressionAttributeNames: {
        '#ca': 'created_at'
      },
      ExpressionAttributeValues: {
        ':from': ago
      },
      FilterExpression: '#ca >= :from',
    }

    this.docClient.scan(params, function(err, data){
      if(err){
          console.log(err);
      }else{
         data.Items.forEach(function(item, _){
             console.log(item);
         });
      }
    });
  }
}

export default DBClient;
