const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const connectTodatabase = require('./db')
connectTodatabase();

const port = 3000;

const app = express();
app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'i am live' })
})
app.use('/books', require('./router/book'));

app.use(express.static("storage/"))

app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`)
})



