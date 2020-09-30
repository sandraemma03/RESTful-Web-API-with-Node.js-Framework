/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block          |
|  ===============================================*/

class Block{
  constructor(data){
   this.hash = "",
   this.height = 0,
   this.body = data,
   this.time = 0,
   this.previousBlockHash = ""
 }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  constructor(){
    this.getBlockHeight().then((height) => {
      if (height === -1){ 
        this.addBlock(new Block("First block in the chain - Genesis block"));
        console.log("Genesis Block added");
      }
    });
  }      

  // Add new block
  async addBlock(newBlock){
    const height = parseInt(await this.getBlockHeight());
    // Block height
    newBlock.height = height + 1;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height>0){
      const prevBlock = await this.getBlock(height); 
      newBlock.previousBlockHash = prevBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Print new block hash
    console.log('new hash ' + newBlock.hash);
    // Adding block object to chain
    await this.addBlockToLevelDB(newBlock.height, JSON.stringify(newBlock));
  }

  // Get block height
  async getBlockHeight(){
    return await this.getBlockHeightFromLevelDB();
  }


  // get block
  async getBlock(blockHeight){
    // return object as a single string
    return JSON.parse(await this.getLevelDBData(blockHeight));
  }

  // validate block
  async validateBlock(blockHeight){
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
      return true;
    } else {
      console.log('Block # '+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
      return false;
    }
  }

   // Validate blockchain
   async validateChain(){
    let errorLog = [];
    let previousHash = ''

    const Height = await this.getBlockHeightFromLevelDB();
    
    for (var i = 0; i <= Height; i++) {
      let block = await this.getBlock(i)
      // this.getBlock(i).then((block) => {

        let isValidBlock = false;
          // validate block
          isValidBlock = await this.validateBlock(block.height);
          if (!isValidBlock) {
            errorLog.push(i);
          } 
          // compare blocks hash link
          if (block.previousBlockHash !== previousHash) {
            errorLog.push(i);
          }

          previousHash = block.hash
          if (i === (Height -1)) {
            if (errorLog.length > 0) {
              console.log('Block errors = ' + errorLog.length);
              console.log('Blocks: '+ errorLog);
            } else {
              console.log('No errors detected');
            }
          }
        // });
    } 
  } 

    // Add block to levelDB with key/value pair
    addBlockToLevelDB(key,value){
      return new Promise(function(resolve, reject) {
        db.put(key, value, function(err) {
          if (err) {
            reject(err);
            return console.log('Block ' + key + ' submission failed', err);
          }
          resolve('Block ' + key + ' submission succeeded');
          return console.log('Block ' + key + ' submission succeeded');

        });
      }); 
    }

    // Get block from levelDB with key
    getLevelDBData(key){
      return new Promise(function(resolve, reject) {
        db.get(key, function(err, value) {
          if (err){ 
            reject(err);
          } 
          resolve(value); 
        }); 
      }); 
    }

    // Get block height from LevelDB
    getBlockHeightFromLevelDB() {
      return new Promise(function(resolve, reject) {
        let i = -1;
        db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
          reject(err);
          return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          resolve(i);
          return console.log('Read data stream number ' + i)
        });
      });
    }
  }

module.exports = Blockchain


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

// let blockchain = new Blockchain();

// (function theLoop (i) {
//   setTimeout(() => {
//     blockchain.addBlock(new Block(`Testing data ${i}`))
//     if (--i) {
//       theLoop(i)
      
//     }
//   }, 100);
// })(10);

// blockchain.validateChain();

// let blockchain = new Blockchain();

// setTimeout(async function() {
//   console.log(await blockchain.getBlockHeight());
//   await blockchain.addBlock(new Block("test--1"));
//   await blockchain.validateBlock(1);
//   await blockchain.validateChain();
// }, 1200);
