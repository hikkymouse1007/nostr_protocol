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
         data.Items.forEach(function(item, index){
             console.log(item);
         });
      }
    });
  }
}

export default DBClient;
