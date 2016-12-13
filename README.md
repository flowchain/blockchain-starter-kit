| <a href="README_zh-TW.md">正體中文</a> |

<img src="http://block0.org/images/block0.org.jpg" />

Project template to create as simple as possible implementation of a blockchain with Node.js 4+ and JavaScript.

# Blockchain Starter Kit

Extremely simple block chain: a project template to create as simple as possible blockchain system.

Block # 0, also known as Genesis Block, is the first block of its blockchain system. This project provides a minimal blockchain implementation for teaching and research, and you can be provided the simplest way to understand the blockchain.

## 主要特色

* Import _Genesis Block_
* An exetremly simple mining algorithm
* A simple and lightweight REST-style RPC system
* A p2p network system over WebSocket
* There is no proof-of-work implementation

## Testing

To start a mining node:

```
git clone https://github.com/jollen/blockchain-starter-kit.git
cd blockchain-starter-kit
npm install
node index.js
```

To start a mining node and join an existing network:

```
export PORT=8001
node node1.js
```

## License

Copyright (C) 2016-present Jollen. The source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.
