const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

exports.createDatabaseAndCollection = function () {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        console.log('数据库已创建');
        const dbase = db.db("pingo");
        dbase.createCollection('order', function (err, res) {
            if (err) throw err;
            console.log("创建集合!");
            db.close();
        });
    });
}

exports.insertRecord = function (_url, _db, _col, _dict) {
    MongoClient.connect(_url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        const dbo = db.db(_db);
        dbo.collection("order").insertOne(_dict, function (err, res) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
        });
    });
}
// 鼠标右键，格式化
// 可以配置一下编辑器，保存的时候自动触发格式化
// 我们用 ES6，尽量不要用 var 关键字  那用啥撒
// 不变的用 const 变的用 let
// 看这个 http://mongodb.github.io/node-mongodb-native/3.1/api/