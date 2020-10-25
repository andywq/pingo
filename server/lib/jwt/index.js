const crypto = require("crypto")

/**
 * 生成 JWT token
 * @param {*} payload
 * @returns {string}
 */
exports.genJwtToken = (payloadObj, secret) => {
  const rawHeader = JSON.stringify({ typ: "JWT", alg: "SHA256" })
  const rawPayload = JSON.stringify(payloadObj)

  const header = new Buffer(rawHeader).toString("base64")
  const payload = new Buffer(rawPayload).toString("base64")

  const toSign = header + "." + payload
  const sign = crypto.createHmac("sha256", secret).update(toSign).digest().toString("base64")

  const token = toSign + "." + sign
  return token
}

/**
 * 校验 JWT token
 * 失败返回 null，成功返回 payload
 * @param {string} token
 * @param {string} secret
 *
 * @return {*} payload
 */
exports.verifyJwtToken = (token, secret) => {
  const [header, payload, sign] = token.split(".")

  const toSign = header + "." + payload
  const newSign = crypto.createHmac("sha256", secret).update(toSign).digest().toString("base64")

  if (newSign !== sign) {
    return null
  }

  const rawPayload = new Buffer(payload, "base64").toString()
  return JSON.parse(rawPayload)
}
