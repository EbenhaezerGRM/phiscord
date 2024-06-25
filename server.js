const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db('phiscord');
    const usersCollection = db.collection('users');

    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      const user = { username, password };
      await usersCollection.insertOne(user);
      res.send('User registered successfully');
    });

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      const user = await usersCollection.findOne({ username, password });
      if (user) {
        res.send('Login successful');
      } else {
        res.send('Invalid username or password');
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
  }
}

run().catch(console.dir);
