const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'c722a58eeac740dab580b346ab19efb6'
});

const handleApiCall = (req, res) =>{
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL, req.body.input)
            .then(data => {
                res.json(data)
            })
            .catch(err => res.status(400).json('Error API'))
}

const handleImage = (req,res,db) =>{
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Error updating user entries'))
};

module.exports ={
    handleImage,
    handleApiCall
};