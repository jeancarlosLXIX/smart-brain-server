const handleRegister = (req, res, db, bcrypt) =>{
    //using destructoring with the json from the front-end
    const {email, name, password} = req.body;

    //checking if the values are not empty

    if(!email || !name || !password){
        return res.status(400).json('Some filds are empty')
    }

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
}

module.exports = {
    handleRegister
}