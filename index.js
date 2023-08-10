const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

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
      res.json({ success: true, data: "Hello" });
    });
    app.get("/products", async (req, res) => {
      const data = await client
        .db("pc-builder")
        .collection("products")
        .find({})
        .project({
          id: 1,
          image: 1,
          productName: 1,
          category: 1,
          price: 1,
          status: 1,
          individualRating: 1,
        })
        .toArray();
      res.json({ success: true, data });
    });
    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;

      const data = await client
        .db("pc-builder")
        .collection("products")
        .findOne({ id: Number(id) });
      res.json({ success: true, data });
    });
    app.get("/products/category/:category", async (req, res) => {
      const { category } = req.params;
      let data = [];
      if (category !== "others") {
        data = await client
          .db("pc-builder")
          .collection("products")
          .find({ category: { $regex: category, $options: "i" } })
          .project({
            id: 1,
            image: 1,
            productName: 1,
            category: 1,
            price: 1,
            status: 1,
            individualRating: 1,
          })
          .toArray();
      } else {
        data = await client
          .db("pc-builder")
          .collection("products")
          .find({
            category: {
              $nin: [
                "Processor",
                "RAM",
                "Motherboard",
                "Monitor",
                "Power Supply",
                "Storage Device",
              ],
            },
          })
          .toArray();
      }
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
