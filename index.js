const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterelectorn.nbq5yot.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("electronDB");
    const brandProducts = database.collection("brandProducts");
    const productAds = database.collection("productAds");
    const cartProducts = database.collection("cartProducts");

    app.get("/products", async (req, res) => {
      const cursor = brandProducts.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandProducts.findOne(query);
      res.send(result);
    });
    app.get("/productAds", async (req, res) => {
      const cursor = productAds.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await brandProducts.insertOne(newProduct);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const cursor = cartProducts.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addToCart", async (req, res) => {
      const newProduct = req.body;
      const result = await cartProducts.insertOne(newProduct);
      res.send(result);
    });

    app.patch('/product/update/:id', async(req, res) => {
      const id = req.params.id;
      const updatedProduct = {
          $set: req.body
      }
      const query = { _id: new ObjectId(id)};
      const result = await brandProducts.updateOne(query, updatedProduct);
      res.send(result);
  })

    app.delete('/cart/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await cartProducts.deleteOne(query);
      res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("electron is running");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
