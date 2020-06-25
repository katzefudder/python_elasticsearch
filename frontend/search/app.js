var client = require("./connection.js");
var express = require('express');
var app = express();
const path = require('path'); // Require library to help with filepaths

app.use(express.urlencoded({ extended: false })); // Middleware to recognize strings and arrays in requests
app.use(express.json()); // Middleware to recognize json in requests
app.use(express.static("public")); // Must have this or else access to index.js will 404

// Homepage route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/search/:title', function (req, res) {
        doFuzzySearch(req.params.title)
    .then(function(resp) {
        console.log("Fuzzy Search returned:", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

app.get('/getAllPictures', function (req, res) {
    getAllPictures()
    .then(function(resp) {
        console.log("Search All returned:", resp);
        res.send(resp);
    }, function(err) {
        console.trace(err.message);
        res.send(err.message);
    });
});

// Start listening for requests on port 3000
app.listen(8080, function () {
  console.log('App listening for requests...');
});

function getAllPictures() {
    return client.search({
        index: 'galleries',
            "size" : 10000,
            body: {
                "query": {
                    "match_all" : {}
                },
                "_source": ["headline", "caption", "keywords", "filename"]
            }
    });
}

function doFuzzySearch(query) {
    return client.search({
        index: 'galleries',
        size: 10,
        body: {
            "query": {
                "multi_match" : {
                    "query" : query,
                    "fields": ["headline", "caption", "keywords", "filename"],
                    "fuzziness": "AUTO"
                }
            },
            "_source": ["headline", "caption", "keywords", "filename"],
            "size": 10
        }
    });
}