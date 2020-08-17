const fs = require("file-system");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    // TODO: connect...
    await client.connect();
    // TODO: declare 'db'
    const db = client.db("exercise_1");
    // We are using the 'exercises' database
    // and creating a new collection 'greetings'
    const r = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, r.insertedCount);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }

  // TODO: close...
  client.close();
};

batchImport();
