import DBClient from './dbClient.js';

const client = new DBClient();

console.log(await client.fetchAllData())
