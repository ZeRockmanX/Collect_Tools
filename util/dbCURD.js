let MongoClient = require('mongodb').MongoClient;

//let dbUrl = 'mongodb://X0575:27017';
let dbUrl = 'mongodb://localhost:27017';
let dbName = "spider_rakuten";
let collectionPrefixion = "Article_";

module.exports = {
    SelectById: async function select(article_id) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(dbUrl, async function (err, db) {
                if (err) {
                    throw err;
                } else {
                    var dbo = db.db(dbName);
                }
                await dbo.collection(collectionPrefixion + article_id).find({}, {}).toArray(function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("select success");
                        resolve(result);
                    }
                    db.close();
                });
            });
        });
    },

    collectinsertMongo: function insert(insertData, article_id) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(dbUrl, async function (err, db) {
                if (err) {
                    throw err;
                } else {
                    var dbo = db.db(dbName);
                }
                await dbo.collection(collectionPrefixion + article_id).insertOne(insertData, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("insert success");
                        resolve(result);
                    }
                    db.close();
                });
            });
        });
    },

    checkhash: function select(hash, article_id) {
        return new Promise(async function (resolve, reject) {
            MongoClient.connect(dbUrl, async function (err, db) {
                if (err) {
                    throw err;
                } else {
                    var dbo = db.db(dbName);
                }
                let whereStr = {"hash": hash};  // 查询条件
                await dbo.collection(collectionPrefixion + article_id).find(whereStr).count(function (err, count) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(count);
                    }
                });
                db.close();
            });
        });
    },
    deleteStoreData: function select(article_id) {
        return new Promise(async function (resolve, reject) {
            MongoClient.connect(dbUrl, async function (err, db) {
                if (err) {
                    throw err;
                } else {
                    var dbo = db.db(dbName);
                }
                //先创建后删除（防止删除操作报错），如果已有合集存在则忽略，也可替换为查找书否存在合集（exist函数已废除，无法使用）
                await dbo.createCollection(collectionPrefixion + article_id);
                await dbo.collection(collectionPrefixion + article_id).drop(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
                console.log("Drop collection " + collectionPrefixion + article_id + " execute success");
            });
        });
    }
};



