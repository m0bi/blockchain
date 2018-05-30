
let Block = require('./block')
let Blockchain = require('./blockchain')
let BlockchainNode = require('./BlockchainNode')
let Transaction = require('./transaction')

let fetch = require('node-fetch')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let port = 3000

// access the arguments change port when spawning node arrays e.g. node app.js 3000 + node app.js 3001 provides two blockchain nodes.
process.argv.forEach(function(val,index,array){
  port = array[2]
})

if(port == undefined) {
  port = 3000
}

let transactions = []
let nodes = []
let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)

app.use(bodyParser.json())

app.get('/resolve',function(req,res){ // resolve node conflicts

  nodes.forEach(function(node){

      fetch(node.url + '/blockchain')
      .then(function(response){
        return response.json()
      })
      .then(function(otherNodeBlockchain){

          if(blockchain.blocks.length < otherNodeBlockchain.blocks.length) {
            blockchain = otherNodeBlockchain
          }

          res.send(blockchain)

      })

  })

})

app.post('/nodes/register',function(req,res){ //register nodes with post method. Key is "urls" object is array with "url" keyed serveres to be registered.

  let nodesLists = req.body.urls
  nodesLists.forEach(function(nodeDictionary){
    let node = new BlockchainNode(nodeDictionary["url"])
    nodes.push(node)
  })

  res.json(nodes)

})

app.get('/nodes',function(req,res){ //list active nodes. If it is empty you will not see the right functionality.
  res.json(nodes)
})

app.get('/',function(req,res){
  res.send("hello cryptonomicon")
})

app.get('/mine',function(req,res){ //mine blocks

    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block)
    transactions = []
    console.log(transactions)
    res.json(block)
})

app.post('/transactions',function(req,res){ //list transactions 

  console.log(transactions)

  let to = req.body.to
  let from = req.body.from
  let amount = req.body.amount

  let transaction = new Transaction(from,to,amount)

  transactions.push(transaction)

  res.json(transactions)

})

app.get('/blockchain',function(req,res){ //outputs blockchain

  res.json(blockchain)

})

app.listen(port,function(){
  console.log("server has started")
})
