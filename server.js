const express = require('express');
var request = require('request');
const app = express();
const axios = require('axios');
var bodyParser = require('body-parser');
const router = express.Router();

let output = "";
let code = ``;

var program = {
    script: code,
    stdin: "1 \n 2",
    language: "java",
    versionIndex: "3",
    clientId: "7ca68a9f7ef5a8ba75361c0c9be79a9c",
    clientSecret: "86434b93d7121e507991d382fa2d2356d6770854909c793ee044056d23f4973f"
};

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { output: "None", input: code });
});

app.get('/output', (req, res) => {
    axios.post('https://api.jdoodle.com/v1/execute', program)
        .then(function (response) {
            console.log(program);
            console.log(response.data);
            output = response.data.output;
            res.render('index', { output: output, input: code });
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.post('/getinput', (req, res) => {
    console.log(req.body.code);
    code = req.body.code;
    program.script = code;
});

app.listen(3000);