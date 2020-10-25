const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require("crypto")


class Jwt{
    constructor(data){
        this.data = data;
    }

    generateToken(){
        let headerStr = "{\"typ\":\"JWT\",\"alg\":\"HS256\"}"
        let payloadStr = this.data.toString();
        let cert = fs.readFileSync(path.join(__dirname,'../pem/private_key.pem'));
        // let created = Math.floor(Date.now()/1000);
        // let cert = fs.readFileSync(path.join(__dirname,'../pem/private_key.pem'));
        // let token = jwt.sign({
        //     data,
        //     exp:created + 60 *30,
        // },cert,{algorithm:'RS256'})

        let header = new Buffer(headerStr);
        let encodeHeader = header.toString('base64');

        let payload = new Buffer(payloadStr);
        let encodePayload = payload.toString('base64');
        let encodedString = encodeHeader+"."+encodePayload

        let hmac = crypto.createHmac("sha256",cert);
        let sign = hmac.update(encodedString).digest()
        console.log("====== sign"+sign)
        let token = encodedString+"."+sign;
        console.log("====== token"+token)
        return token;
    }

    verifyToken(token){
        if (token == this.generateToken()){
            return true;
        }
    }
}


module.exports = Jwt;

