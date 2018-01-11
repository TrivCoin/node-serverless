'use strict';

const TrivCoin = require("trivcoin");
const node = new TrivCoin.Node(null, "ADDRESS");

module.exports.transactionNew = (event, context, callback) => {    
    console.log("EVENT", event);
    try {
        callback(null, node.receive(JSON.parse(event.body)));
    } catch(error) {
        callback(error);
    }

};
