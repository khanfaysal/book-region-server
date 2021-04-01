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
  console.log('Database Connection Successfully');
  // perform actions on the collection object
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})