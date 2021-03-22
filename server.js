const express = require('express');
const bcrypt = require('bcrypt-nodejs'); //https://www.npmjs.com/package/bcrypt
const cors = require('cors'); //to avoid Access-control-Allow-Origin
const knex = require('knex'); //http://knexjs.org/

        /***** CONTROLLERS  *****/
const register = require('./controllers/register.js');
const signin = require('./controllers/sigin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  });

const app = express();

app.use(express.json())
app.use(cors())
/*
instead of having (req,res) => {signin.handleSignin(req, res, db, bcrypt)}
we could have just signin.handleSignin(db, bcrypt) because the request and response come automatically
*/
app.get('/', (req, res)=> { res.send('it works') });
//make sure it's a post because we will request (req) data
app.post('/signin',signin.handleSignin(db, bcrypt));

 // dependency injection
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

//getting the profile of our user
app.get('/profile/:id',(req, res) => {profile.handleProfileGet(req, res, db)});

//update the entries
app.put('/image',(req, res) => {image.handleImage(req, res,db)});
app.post('/imageurl',(req, res) => {image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3001, ()=>{
    console.log(`server is working at port ${process.env.PORT}`);
})
