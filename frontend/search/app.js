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

// Route to search for Articles by title
app.get('/search/:title', function (req, res) {
    // Access title like this: req.params.title
    /* Query using slop to allow for unexact matches */
    client.search({
        index: 'galleries',
        size: 10,
        body: {
            "query": {
                "multi_match" : {
                    "query" : req.params.title,
                    "fields": ["headline", "caption", "keywords", "filename"],
                    "fuzziness": "AUTO"
                }
            },
            "_source": ["headline", "caption", "keywords", "filename"],
            "size": 10
        }
    }).then(function(resp) {
        console.log("Successful query! Here is the response:", resp);
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