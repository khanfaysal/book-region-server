const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const port = process.env.PORT || 5055;


app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brk1j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const booksCollection = client.db("bookdb").collection("books");

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
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})