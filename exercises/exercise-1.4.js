const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  await db.collection("users").insertOne(req.body);

  const users = await db.collection("users").find().toArray();
  client.close();
  res.status(201).json({ status: 201, data: users });
};

module.exports = { addUser };
