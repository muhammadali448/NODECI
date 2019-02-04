const { Buffer } = require("safe-buffer");
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip1 = new Keygrip([keys.cookieKey]);
module.exports = user => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );
  const sig = keygrip1.sign("session=" + sessionString);
  return {
    sessionString,
    sig
  };
};
