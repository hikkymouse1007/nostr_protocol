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
