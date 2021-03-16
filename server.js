const express = require('express');
const bcrypt = require('bcrypt-nodejs'); //https://www.npmjs.com/package/bcrypt
const cors = require('cors'); //to avoid Access-control-Allow-Origin
const knex = require('knex'); //http://knexjs.org/
const { json } = require('express');

const db = knex({
    client: 'pg',
    version: '7.2',
    connection: {
      host : '127.0.0.1',
      user : 'jeankai',
      password : '9728',
      database : 'smart-brain'
    }
  });

const app = express();

app.use(express.json())
app.use(cors())

//make sure it's a post because we will request (req) data
app.post('/signin', (req, res) =>{
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data =>{
           const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
           
           if(isValid){
               return db.select('*').from('users')
               .where('email', '=', req.body.email)
               .then(user =>{
                   res.json(user[0])
               })
               .catch(err => res.status(400).json('Unable to get user'));
           } else{
               res.status(400).json("Wrong credentials")
           }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
});

 //adding new user to our database
app.post('/register', (req,res) =>{
    //using destructoring with the json from the front-end
    const {email, name, password} = req.body;

    const hash = bcrypt.hashSync(password);

    db.transaction(trx =>{ //create a transsaction when we has to do more than one thing at once
        //use trx instead of db
        trx.insert({
            hash,
            email
        })
        .into('login') //here we take the hash and email to our login table an then go to the 
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*') //just saying that we'll return all 
            .insert({
                email: loginEmail[0], //because we are returning an array so we want the first element en avoid {"kai@gmail.com"} in the db
                name,
                joined: new Date()
            })
            .then(user =>{
                res.json(user[0]) //user[0] to ensure is not an array
            })
        })
        .then(trx.commit) //to send the  "commit" to our database and see the changes
        .catch(trx.rollback)
    })    
    .catch(err => res.status(400).json('Unable to register')) 
    //if we keep json(err) we'll be sending information about our system to the users and we don't wanna it. 


})

//getting the profile of our user
app.get('/profile/:id', (req,res) =>{
    const {id} = req.params;

    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        } else{
            res.status(400).json('User not found')
        }
        
    })
    .catch(err => res.status(400).json('Error getting user'))
})

//update the entries
app.put('/image',(req,res) =>{
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Error updating user entries'))
})




// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3001, ()=>{
    console.log('server is working');
})


/*
I will install npm install bcryptjs another version from the video if this does not work I'll use the decapred one called
npm i bcrypt-nodejs
*/