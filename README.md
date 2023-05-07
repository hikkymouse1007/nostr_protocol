# nostr_protocol
- Implementation based on the repo below:
https://github.com/nbd-wtf/nostr-tools#usage

- result
![スクリーンショット 2023-05-07 16 48 52](https://user-images.githubusercontent.com/54907440/236665240-78632159-3ae6-4151-9563-ff8eb74c4c11.png)


- What are some of the challenges you faced while working on Phase 1?
  - I had previously worked with web sockets, so I had a basic understanding of how they work. However, I had no knowledge of the Nostr Protocol, so I had no idea how to implement the code. However, during my research, I came across a JavaScript tool called [nostro-tools](https://github.com/nbd-wtf/nostr-tools), which allowed me to connect to the server based on this tool.
  Through implementing with this tool, I was able to gain a general understanding of how to connect to the relay server and publish events using this protocol.

- What kind of failures do you expect to a project such as DISTRISE to encounter?
   - The server architecture can not handle the increased load from multiple connections, as with traditional WebSocket implementations.
   - In the event of a system failure, data restoration can not be performed correctly.
   - Ensuring the security and (if necessary, anonymity) of transmitted data.
