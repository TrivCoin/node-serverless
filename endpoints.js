'use strict';

const TrivCoin = require("trivcoin");
const node = new TrivCoin.Node(null, "ADDRESS");



module.exports.rpc = (event, context, callback) => {    
    try {
        const response = node.receive(JSON.parse(event.body));        
        console.log("ENV", process.env);
        callback(null, {
            "isBase64Encoded": false,
            "statusCode": response.error ? 400 : 200,
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(response)
        });
    } catch(error) {
        callback(error);
    }

};
