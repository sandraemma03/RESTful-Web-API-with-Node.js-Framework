'use strict';

const Hapi=require('hapi');
const Blockchain = require('./simpleChain');
let blockchain = new Blockchain();

// Create a server with a host and port
const server = Hapi.server({
    host:'localhost',
    port:8000
});

// Add the route
server.route({
    method:'GET',
    path:'/hello',
    handler: async function(request,reply) {

        return'hello world';
    }
});

// Get block height route
server.route({
    method: 'GET',
    path: '/block/{height}',
    handler: async function(request, reply) {
        try {
            const blockHeight = await blockchain.getBlock(request.params.height);
            return (blockHeight);
        // reply(blockHeight);
        } 
        catch (err) {
            console.log(err);
        }
    }
});

// Post new block route
server.route({
    method: 'POST',
    path: '/block',
    handler: async function (request, reply) {
        try {
            // reply(request.payload);
            const addblock = await blockchain.addBlock(request.payload);
            const height = await blockchain.getBlockHeight();
            const blockHeight = await blockchain.getBlock(height);

            return (blockHeight);
        } 
        catch (err) {
            console.log(err);
        }
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();