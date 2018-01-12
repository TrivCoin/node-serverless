'use strict';

const TrivCoin = require("trivcoin");
const S3DB = require("./s3");
const node = new TrivCoin.Node(null, "ADDRESS", new S3DB("blocks"), new S3DB("transactions"));

module.exports.rpc = (event, context, callback) => {
    console.log("ENV", process.env);
    try {
        node
            .receive(JSON.parse(event.body))
            .then(response => {
                callback(null, {
                    "isBase64Encoded": false,
                    "statusCode": response.error ? 400 : 200,
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify(response)
                });
            })
            .catch(error => {
                callback(null, {
                    "isBase64Encoded": false,
                    "statusCode": 500,
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify({
                        "error": {
                            "code": error.code,
                            "message": error.message,
                            "details": error
                        }
                    })
                });
            });
    } catch (error) {
        callback(null, {
            "isBase64Encoded": false,
            "statusCode": 500,
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({
                "error": {
                    "code": error.code,
                    "message": error.message,
                    "details": error
                }
            })
        });
    }

};
