const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjoai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('puppiesShop')
        const productsCollections = database.collection('products');
        const ordersCollections = database.collection('orders');
        const reviewsCollections = database.collection('reviews');
        const usersCollections = database.collection('users');





        // ========================= post product ========================




        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollections.insertOne(product)
            // console.log(result);
            res.json(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollections.insertOne(order);
            // console.log(result);
            res.json(result)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollections.insertOne(review);
            console.log(result);
            res.json(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollections.insertOne(user);
            console.log(result);
            res.json(result)
        })




        // ====================== get products =============================






        app.get('/products', async (req, res) => {
            const cursor = productsCollections.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollections.find({});
            const result = await cursor.toArray();
            res.send(result)
            // console.log(result);
        })

        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const newEmail = ({ email: email });
            const cursor = ordersCollections.find(newEmail)
            console.log(newEmail);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollections.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollections.findOne(query);
            let isAdmin = false
            if (user?.role == 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.get('/managerOrder', async (req, res) => {
            const cursor = ordersCollections.find({});
            const orders = await cursor.toArray();
            res.json(orders)
        })


        // ========================  update method =========================




        app.put('/users/makeAdmin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollections.updateOne(filter, updateDoc);
            console.log(result);
            res.send(result);
        })


        app.put('/status/:id', async (req, res) => {
            console.log('result');
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const updateDoc = { $set: { status: req.body.status } };
            const result = await ordersCollections.updateOne(query, updateDoc)
            res.send(result);
        })



        // ========================  get singleItems =========================





        app.get('/singleProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollections.findOne(query);
            console.log(product)
            res.json(product);
        })






        // ====================  delete data =======================





        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollections.deleteOne(query);
            console.log(result)
            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollections.deleteOne(query);
            console.log(result)
            res.send(result)
        })




    }

    finally {
        // await client.close()
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello !! server is live');
})

app.listen(port, () => {
    console.log('server is running at port ', port);
})