const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Local Server is runnig... For warehouse management");
})

app.get("/services", (req, res) => {
    res.send("Services...");
})



// Database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xenpn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// load all data
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('cycleStore').collection('products');
        const blogCollection = client.db('cycleStore').collection('blogs');

        // Products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // Blogs 
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // Find product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log('My port is running', port);
})