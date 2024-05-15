const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  })
);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("egadgets");
    const gadgetCollection = db.collection("gadgets");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // -----------------  add Gadget  ------------------
    app.post("/add-gadget", async (req, res) => {
      const gadgetData = req.body;

      const returnInfo = await gadgetCollection.insertOne(gadgetData);
      console.log("gadgetData", gadgetData, returnInfo);

      res.status(201).json(returnInfo);
    });
    // -----------------  get all gadget   ------------------
    app.get("/all-gadgets", async (req, res) => {
      const returnInfo = await gadgetCollection.find().toArray();

      res.status(201).json(returnInfo);
    });

    // -----------------  get single gadget  -------------------
    app.get("/gadget/:id", async (req, res) => {
      const id = req.params.id;

      const returnInfo = await gadgetCollection.findOne({
        _id: new ObjectId(id),
      });
      // console.log(id, returnInfo);
      res.status(201).json(returnInfo);
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
  };
  res.json(serverStatus);
});
