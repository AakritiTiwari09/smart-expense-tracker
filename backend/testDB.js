// testDB.js
const db = require("./db");

async function test() {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime");
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}

test();