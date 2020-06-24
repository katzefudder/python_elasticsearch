var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
  hosts: ["http://es01:9200"]
});

module.exports = client;