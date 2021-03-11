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

const database = {

   users:[ 
       {
        id: '123',
        name: 'Jean',
        email: 's@gmail.com',
        password: 'z',
        entries: 0,
        joined: new Date()
    },
    {
        id: '124',
        name: 'Sasha',
        email: 'grey@gmail.com',
        password: '696969',
        entries: 0,
        joined: new Date()
    }
]
}
app.get('/', (req,res)=>{
    res.json(database.users)
})

//make sure it's a post because we will request (req) data
app.post('/signin', (req, res) =>{
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('user or password wrong')
    }
    res.json('signin working')
});

 //adding new user to our database
app.post('/register', (req,res) =>{
    //using destructoring with the json from the front-end
    const {email, name, password} = req.body;

    return db('users')
    .returning('*') //just saying that we'll return all 
    .insert({
        email,
        name,
        joined: new Date()
    })
    .then(user =>{
        res.json(user[0]) //user[0] to ensure is not an array
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