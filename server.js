const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const CryptoJS = require("crypto-js");


//controllers
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const images = require('./controllers/images');

//-----database----
const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true,
  } 
  
});

const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

//at home page 
app.get('/', (req, res) => {      
    res.send('success');
})
app.get('/apikey', (req, res)=> {

  var ciphertext = CryptoJS.AES.encrypt('675f0da7db3f47428cb8c7a53f87da41', 'key').toString();
  res.json(ciphertext);

})

//Sign In Post
app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt)});

//User Register - depenency injection  calling the handle fn with these variables
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});


//Users Home/Account page
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

app.put('/image', (req, res) =>{ images.handleImages(req, res, db)});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}!`)
})


