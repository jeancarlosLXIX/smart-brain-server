const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors') //to avoid Access-control-Allow-Origin

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

    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });

database.users.push({
        id: '125',
        name,
        email,
        password,
        entries: 0,
        joined: new Date()
});

res.json(database.users[database.users.length-1])
})

//getting the profile of our user
app.get('/profile/:id', (req,res) =>{
    const {id} = req.params;
    let userFound = false;

    database.users.forEach(user =>{
        if(user.id === id ){
            //if the id of the params maches with the id of our database, respond with that user
            // a return to stop it from looping 
            userFound = true;
           return  res.json(user)
        }
    })
    if(!userFound){
        return res.status(400).json('not found')
    }
})

//update the entries
app.put('/image',(req,res) =>{

    const {id} = req.body;
    let userFound = false;

    database.users.forEach(user =>{
        if(user.id == id ){
            //if the id of the params maches with the id of our database, respond with that user
            // a return to stop it from looping 
            userFound = true;
            user.entries++
           return  res.json(user.entries)
        }
    })
    if(!userFound){
        return res.status(400).json('not found')
    }
    
    
})




// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3001, ()=>{
    console.log('app is working');
})


/*
I will install npm install bcryptjs another version from the video if this does not work I'll use the decapred one called
npm i bcrypt-nodejs
*/