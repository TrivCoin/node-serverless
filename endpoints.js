'use strict';

const TrivCoin = require("trivcoin");
const node = new TrivCoin.Node(null, "ADDRESS");

module.exports.rpc = (event, context, callback) => {    
    console.log("EVENT", event);
    console.log("EVENT", event.body);
    try {
        const response = node.receive(JSON.parse(event.body));        
        console.log("RESPONSE", response);
        callback(null, resposne);
    } catch(error) {
        console.log("ERROR", error);
        callback(error);
    }

};
