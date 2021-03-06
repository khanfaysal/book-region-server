const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 5055;

app.get('/',(req, res) =>{
  res.send("hello everything works fine")
})

app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brk1j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
    const booksCollection = client.db("bookdb").collection("books");
    const orderList = client.db("bookdb").collection("orders");
// all books API database code
  app.get('/books', (req, res) => {
    booksCollection.find()
    .toArray((err, book) => {
      res.send(book)
    })
  })

  app.post('/addBookInfo', (req, res) => {
      const newBookInfo = req.body;
      console.log('adding book info', newBookInfo)
      booksCollection.insertOne(newBookInfo)
    .then(result =>{
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })
//   client.close();

// order books API database code
app.get('/orders', (req, res) => {
  orderList.find({})
  .toArray((err, documents) => {
      res.send(documents);
  })
})


app.post('/addOrder', (req, res) => {
      const newOrder = req.body;
      console.log(newOrder)
      orderList.insertOne(newOrder)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0);
    })
})

// delete specific books API database code
  app.delete('/deleteBook/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id)
    booksCollection.findOneAndDelete({_id:id})
    .then(document => res.send(document.value))
  })

});
app.listen(process.env.PORT || port)