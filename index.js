const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2hcl8v.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db('brandShopDB').collection('user');
    const productCollection = client.db('brandShopDB').collection('product');
    const cartCollection = client.db('brandShopDB').collection('cart');

    // Cart API's Data

    app.get('/carts', async(req, res) =>{
      const carts = await cartCollection.find().toArray();
      res.send(carts);
    })

    app.post('/carts', async(req, res) =>{
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
      console.log(result);
    })

    //Product API's Data

    app.get('/products', async(req, res) =>{
      const products = await productCollection.find().toArray();
      res.send(products);
    })
    
    app.get('/products/:id', async(req, res) =>{
      const id = req.params.brand;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

  
    
    app.post('/products', async(req, res) =>{
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
      console.log(result);
    })

    //User APIs Data
    app.get('/users', async(req, res) =>{
      const users = await userCollection.find().toArray();
      res.send(users);
    })

    app.post('/users', async(req, res) =>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.patch('/users', async(req, res) =>{
      const user = req.body;
      const filter = {email: user.email}
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
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
  res.send("Mu Brand Shop server is running");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});

