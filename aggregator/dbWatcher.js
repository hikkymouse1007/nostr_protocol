import DBClient from './dbClient.js';

const client = new DBClient();
setInterval(() => {
    const fetchedData = client.fetchLatestData();
    console.log(fetchedData)
}, 10000);
