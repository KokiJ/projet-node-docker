const express = require('express');
const app = express();
const PORT = 8000;
const mysql = require('mysql')

app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "my-project"
});

con.connect(function(err) {
    if (err) throw err
    console.log("success to connect mysql database")
})

const postsList = [
    {
        id: 1,
        titre: 'post 1',
        content: 'this is the first post'
    }
]

app.get('/',function(req, res){
    res.send('Hello World');
})

app.use(express.json());

//get all post
app.get('/posts', function(req, res){
    const sql = "SELECT * FROM post";
    con.query(sql, function (err, result){
        if (err) throw err;
        res.send(result);
    });
})

//get a single post
app.get('/posts/:id', function(req, res){
    const {id} = req.params;


    con.query("SELECT * FROM post WHERE id = ?", [id], function (err, result){
        if (err) throw err;
        res.send(result[0]);
    });
})

//delete one post
app.delete('/posts/:id', function(req, res){
    const {id} = req.params;

    const post = postsList.find(function(post){
        return post.id == parseInt(id);
    })

    const index = postsList.indexOf(post);

    postsList.splice(index, 1);

    res.send('You have reached the delete route');
})

//create a new post
app.post('/posts', function(req, res) {
    console.log(req.body);

    const data = req.body;

    const sql = "INSERT INTO post SET ?"; // Utilisation de SET avec un objet

    con.query(sql, data, function(err, result) {
        if (err) {
            console.error("Erreur SQL : ", err);
            res.status(500).send("Erreur lors de l'insertion dans la base de données.");
        } else {
            console.log("Enregistrement inséré avec succès !");
            res.status(200).send(result);
        }
    });
});




app.listen(PORT, function(){
    console.log(`Example app listening on port ${PORT}!`);
})