const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 5000;

const uri = process.env.db_uri;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function dbConnection() {
  try {
    await client.connect();
    console.log("Database connection successfull!");

    app.get("/", async (req, res) => {
      const data = await client
        .db("pc-builder")
        .collection("products")
        .find({})
        .toArray();
      res.json({ success: true, data });
    });
    app.get("/:id", async (req, res) => {
      const { id } = req.params;

      const data = await client
        .db("pc-builder")
        .collection("products")
        .findOne({ id: Number(id) });
      res.json({ success: true, data });
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

dbConnection();
