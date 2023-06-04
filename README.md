# nostr_protocol
- Implementation based on the repo below:
https://github.com/nbd-wtf/nostr-tools#usage

## week1
- result
![result](https://user-images.githubusercontent.com/54907440/236665240-78632159-3ae6-4151-9563-ff8eb74c4c11.png)


- What are some of the challenges you faced while working on Phase 1?
  - I had previously worked with web sockets, so I had a basic understanding of how they work. However, I had no knowledge of the Nostr Protocol, so I had no idea how to implement the code. However, during my research, I came across a JavaScript tool called [nostro-tools](https://github.com/nbd-wtf/nostr-tools), which allowed me to connect to the server based on this tool.
  Through implementing with this tool, I was able to gain a general understanding of how to connect to the relay server and publish events using this protocol.

- What kind of failures do you expect to a project such as DISTRISE to encounter?
   - The server architecture can not handle the increased load from multiple connections, as with traditional WebSocket implementations.
   - In the event of a system failure, data restoration can not be performed correctly.
   - Ensuring the security and (if necessary, anonymity) of transmitted data.

## Week2
- References:
  - https://speakerdeck.com/heguro/devtoolsdehazimerujian-dan-nostrpurotokoru-nostrmian-qiang-hui-number-0?slide=9
  - https://achq.notion.site/Distributed-Systems-Project-Briefing-00eaa7a219954bb1a346d73bf09164f2
  - https://scrapbox.io/nostr/NIP-01
  - https://github.com/websockets/ws#api-docs

### Setup
- Run DynamoDB database server
```
docker compose up
```
- Initialize the database to create table
```
node createDB.js
```
- Start running relay server
```
node relayServer.js
```

- Send event to relay server
```
node sampleNostr.js
```
<img width="1426" alt="Stored data in DynamoDB" src="https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/6f99cbca-3a51-4cf7-840b-9af493cef115">


### Challenges faced:
- It was challenging to determine the authentication method for the messages received on the server side and decide how to store the messages on the server using a specific type of database.
- I was unsure about the appropriate handling of REQ and CLOSE data, which made it difficult to successfully implement them.

### RabbitMQ
- https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
- https://github.com/amqp-node/amqplib
- https://komari.co.jp/blog/4271/#ack

```
RABBITMQ_ENDPOINT='amqp://myuser:mypassword@localhost:5672'
```


## week5
### Architecture
You can find my websocket server-side repo here: https://github.com/hikkymouse1007/
nostr_server

![スクリーンショット 2023-06-04 19 23 38](https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/6b6f93e4-fe1f-4bb2-b34f-9c9d2847a6b6)

### Usage
- Run the command to start up your docker compose(including rabbitMQ and dynamoDB for local)
```
docker compose up
```
- Open another terminal window and run aggregator.js
```
node aggregator/aggregator.js
```

You can add as many available websocket servers as you want to the array const RELAYS:
```
const RELAYS = ['wss://relay.nekolicio.us/', 'wss://floating-fortress-37708.herokuapp.com'];
```
and you can see the log below:
![スクリーンショット 2023-06-04 19 23 38](https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/8b39ddbe-2131-454f-8f89-c32b03db3cc3)


- Open another window and run eventConsumer.js to consume enqueued event queues and store them to your local DynamoDB database
```
node aggregator/services/eventConsumer.js
```
![スクリーンショット 2023-06-04 19 17 18](https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/8307750f-f448-46ac-a2e7-7c89b97e2b92)


You can see the stored data on your localhost:8001:
![スクリーンショット 2023-06-04 19 23 38](https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/ba8ce570-1fb7-4554-95b9-e8160e5e650d)


- You can see the data by running dbWatcher.js which fetches latest event created within 30 seconds before dbWatcher runs every 10 seconds from your local DynamoDB
```
node dbWatcher
```
![スクリーンショット 2023-06-04 19 23 38](https://github.com/hikkymouse1007/nostr_protocol/assets/54907440/3f5b2cec-8757-42c6-b6ef-827a3fb9f0c7)

However, this code has some problems:
  - You have to scan all data in the table for the aggregator every time dbWatcher runs due to the feature of scanning of DynamoDB
  - You can not see every single data precisely depending on the timing the code runs

But this is for not fetching duplicated data more than once as possible.

## Acknowledgment
I would like to extend my heartfelt thanks to Kyle for his exceptional contribution in the development of the nostro-server implementation using JavaScript. I found immense value in referring to [Kyle](https://github.com/kylemocode)'s repository (https://github.com/kylemocode/nostr-distributed-system-exercise/tree/main/nostr-aggregator) during my work.

His code provided valuable insights into utilizing the nostr-tools and amqplib libraries, enabling me to better understand how to establish communication with the nostro-server and implement queueing functionalities. I am truly grateful for his invaluable assistance.

I would like to take this opportunity to express my sincere appreciation.
