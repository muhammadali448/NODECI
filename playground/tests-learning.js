const { Buffer } = require("safe-buffer");
const Keygrip = require("keygrip");
const session =
  "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWM1MThiZTM0NGY3OWU0MDk4OGFkN2Y4In19";
const sessionIntoObject = Buffer.from(session, "base64").toString("utf8");
console.log("Session into object: ", sessionIntoObject);
const keygrip1 = new Keygrip(["123123123"]);
const sessionsig = keygrip1.sign("session=" + session);
console.log(`Session sig: ${sessionsig}`);
console.log(`Verify: ${keygrip1.verify('session=' + session, 'dpCmXoRIPN1JPD93fwYcS4x5tGI')}`);
