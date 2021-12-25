const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const port = 5000


const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p8xf6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log(err)//errorno jodi undefined ashe tahole db connect tik vabe hoice
    const allCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_allCollection}`);
    const registeredCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_registeredCollection}`);


    //fakeData tekhe sob data db te insert kora hoice.tar jnno ek ta action kora lagce post korte Ul tekhe.korar por oi ta kete dici.example button create kore onclick diye fetch ta patanu hoice 
    app.post('/allTask', (req, res) => {
        const tasks = req.body;
        //   console.log(tasks)
        allCollection.insertMany(tasks)
        // .then((result) => console.log(result))
    });

    //allData db tekhe ui te get kora hocce
    app.get('/getAllData', (req, res) => {
        const search = req.query.search
        allCollection.find({ title: { $regex: search } }).toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.post('/registeredInfo', (req, res) => {
        const registered = req.body;
        registeredCollection.insertOne(registered)
            .then((result) => {
                res.send(result.acknowledged)
            })
    });

    app.get('/register/:_id', (req, res) => {
        const id = req.params._id
        allCollection.find({ _id: id })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    });

    app.get('/getAddedTask', (req, res) => {
        const specificEmail = req.query.email
        registeredCollection.find({ email: specificEmail })
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.delete('/delete/:id', (req, res) => {
        const removeId = req.params.id
        registeredCollection.deleteOne({ _id: removeId })
            .then(result => console.log(result))
    });

    //for admin part
    app.get('/getRegisteredInfo', (req, res) => {
        registeredCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.delete('/volunteerDelete/:id', (req, res) => {
        const removeId = req.params.id
        registeredCollection.deleteOne({ _id: removeId })
            .then(result => {
                // console.log(result)
                res.send(result.acknowledged)
            })
    });


});

app.get('/', (req, res) => {
    res.send('Hello World again!')
})

app.listen( process.env.PORT || port , console.log("listen port 5000"))