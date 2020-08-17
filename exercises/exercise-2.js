const assert = require("assert");
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    // TODO: connect...
    await client.connect();
    // TODO: declare 'db'
    const db = client.db("exercise_1");
    // We are using the 'exercises' database
    // and creating a new collection 'greetings'
    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  // TODO: close...
  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const greetings = await db.collection("greetings").find().toArray();
  let start = 0;
  let limit = 25;
  if (req.query.start !== undefined) {
    start = Number(req.query.start);
  }
  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }
  if (greetings.length > 0) {
    res
      .status(200)
      .json({ status: 200, data: greetings.slice(start, start + limit) });
  } else {
    res.status(404);
  }
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const r = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, r.deletedCount);
    res.status(204).json("bacon");
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting };
