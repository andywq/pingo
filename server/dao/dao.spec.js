
const dao = require("./dao")
const jwt = require("../login/jwt");
const Jwt = require("../login/jwt");
var url = "mongodb://localhost:27017/"; 
var db = "pingo";
var col = "order";
var dict = { name: "拼水果", url: "www.pingo" };
console.log("====");
console.log(dao)
dao.insertRecord(url,db,col,dict);

//#####################3
let payload = {
    "iss": "pingo.com",
    "username": "vicky",
    }
const a = new Jwt(payload);
a.generateToken();
