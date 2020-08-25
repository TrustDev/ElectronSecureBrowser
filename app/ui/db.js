const { MongoClient } = require('mongodb');
const { getEnvVar } = require('./../env');
let db = null;
async function connectDB() {
    const uri = getEnvVar("MONGODB_URL");
    const client = new MongoClient(uri, {
        useNewUrlParser: true
      });
  
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        db = client.db("deamon_log");
    } catch (e) {
        console.error(e);
    }
}

async function closeDB() {
    await client.close();
    db = null;
}

async function insertHistory(ip, url, title)
{
    if (db == null)
    {
        console.log("db null");
        return;
    }
    db.collection('visited_urls', function (err, collection) {
        if( err ) throw err;
        collection.insertOne({ ip_address: ip, visited_url: url, title, created_at: new Date(), updated_at: new Date() });
    });
}

module.exports = {
    connectDB,
    closeDB,
    insertHistory
};