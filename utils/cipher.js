
const crypto           = require('crypto');
const CIPHER_ALGORITHM = 'aes256';
const config           = require('./config.js');
const key = config.secret;
/**
 * Description
 * @method decipherMessage
 * @param {} msg
 * @return ret
 */

module.exports.decode = function (msg) {
    var ret = {};

    try {
        var decipher = crypto.createDecipher(CIPHER_ALGORITHM, key);
        var decipheredMessage = decipher.update(msg, 'hex', 'binary');
        decipheredMessage += decipher.final("binary");
        ret = decipheredMessage;
    } catch (e) {
        console.log('------------------------------------');
        console.log(e);
        console.log('------------------------------------');
        return null;
    }

    return ret;
}

/**
 * Description
 * @method cipherMessage
 * @param {} data
 * @param {} key
 * @return
 */

module.exports.encode = function (data) {
    try {
        var cipher = crypto.createCipher(CIPHER_ALGORITHM, key);
        var cipheredData = cipher.update(data, "binary", "hex");
        cipheredData += cipher.final("hex");
        return cipheredData;
    } catch (e) {
        return null;
    }
}
