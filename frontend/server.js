const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'es01:9200',
  // log: 'trace'
});


const search = async query => {
  const results = await client.search({
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
  })

  return results.hits.hits.map(({ _source: { headline, caption, keywords, filename}}) => ({
    headline, caption, keywords, filename
  }))
}


const main = async query => {
    const results = await search(query);
    console.log(results);
}
  
const args = process.argv.slice(2);
  
main(args.join(' '))