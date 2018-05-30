# blockchain
first blockchain project

## This is a node server spawning app
Servers are spawend via the command line ```node app.js <port>```

Multiple servers may update the ledger asynchronously, and the longest ledger will win.

## Routes

### Root
Nothing Here

### /nodes
List active nodes. If it is empty you will not see the right functionality. Additional servers must be spawned, and their addresses must be posted to the ```./nodes/register``` route.

### /nodes/register
This is a POST route taking an object with key 'urls' and value array of objects with key 'url' and value the server node url.

### /mine
Mines the blockchain

### /transactions
Provides the current list of transactions. What this entire war is over.

### /blockchain
Outputs the current status of the blockchain.
