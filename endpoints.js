'use strict';

const TrivCoin = require("trivcoin");
const S3DB = require("./s3");
const node = new TrivCoin.Node(null, "ADDRESS", new S3DB("blocks"), new S3DB("transactions"));

module.exports.rpc = (event, context, callback) => {
    try {
        node.receive(JSON.parse(event.body))
            .then(respone => {
                console.log("ENV", process.env);
                callback(null, {
                    "isBase64Encoded": false,
                    "statusCode": response.error ? 400 : 200,
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify(response)
                });
            })
            .catch(error => {
                callback(error);
            });
    } catch (error) {
        callback(error);
    }

};
