'use strict';

const TrivCoin = require("trivcoin");
const node = new TrivCoin.Node(null, "ADDRESS");

module.exports.transactionNew = (event, context, callback) => {    

    try {
        callback(null, node.receive(JSON.parse(event.input.body)));
    } catch(error) {
        callback(error);
    }
    callback(null, response);

};
