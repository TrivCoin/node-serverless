
const S3Class = require('aws-sdk/clients/s3')
const S3 = new S3Class();
const BUCKET = process.env.BUCKET.replace(/^arn\:aws\:s3\:\:\:/, "");

/**
 * Create object on S3
 * @param {string} key
 * @param {object} body
 * @returns {Promise}
 */
const create = (key, body) => new Promise((resolve, reject) => S3
    .putObject({
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(body),
        ContentType: 'application/json'
    }, err => {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve();
    }));

/**
 * Check if object exists on S3
 * @param {string} key
 * @returns {Promise<boolean>}
 */
const exists = key => new Promise((resolve, reject) => S3
    .headObject({
        Bucket: BUCKET,
        Key: key
    }, (err, data) => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
    }));

/**
 * Reads content of the object on s3
 * @param {string} key
 * @return {Promise<object>}
 */
const read = (key) => new Promise((resolve, reject) => S3
    .getObject({
        Bucket: BUCKET,
        Key: key
    }, (err, data) => {

        if (err) {
            if (err.code === "NoSuchKey") {
                resolve();
            }
            else {
                reject(err);
            }

            return;
        }

        resolve(JSON.parse(data.Body.toString('utf-8')));
    }));

/**
 * Deletes object from S3
 * @param {key}
 * @return {Promise}
 */
const remove = (key) => new Promise((resolve, reject) => S3
    .deleteObject({
        Bucket: BUCKET,
        Key: key
    }, err => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
    }));
    
/**
 * List all objects in s3 after given key
 * @param {string} afterKey
 * @param {number} length
 * @return {Promise<string[]>}
 */
const scan = (afterKey, length, prefix) => new Promise((resolve, reject) => S3
    .listObjectsV2({
        Bucket: BUCKET,
        StartAfter: afterKey,
        MaxKeys: length,
        Prefix: prefix || undefined
    }, (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data.Contents.map(data => read(data.Key)));
    }));

    
/**
 * List all objects in s3 after given key
 * @param {string} afterKey
 * @param {number} length
 * @return {Promise<object[]>}
 */
const fetch = (afterKey, length, prefix) => new Promise((resolve, reject) => 
    scan(afterKey, length, prefix)
    .then(keys => Promise.all(keys.map(key => read(key)))));

class S3DB {

    constructor(prefix) {
        this.prefix = prefix;
    }

    put(id, data) {
        return create(this.prefix + "/" + id, data);
    }

    get(id) {
        return read(this.prefix + "/" + id);
    }

    has(id) {
        return exists(this.prefix + "/" + id);
    }

    remove(id) {
        return remove(this.prefix + "/" + id);
    }

    ids() {
        return scan(undefined, undefined, this.prefix + "/");
    }

    size() {
        return this.ids().then(ids => ids.length);
    }

    list() {
        return fetch(undefined, undefined, this.prefix + "/");
    }

    sort(sorter) {
        return this.sort().then(list => list.sort(sorter));
    }

    slice(sorter, start, end) {
        return this.sort(sorter).then(list => list.slice(start, end));
    }

}

module.exports = S3DB;
