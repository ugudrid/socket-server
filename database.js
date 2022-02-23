const { MongoClient } = require('mongodb');

// Connection URL
const username = 'saadku64';
const password = 'abcd123@02391##!!fjd'
const dbName = 'urieah_demo';

const url = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.eiokq.mongodb.net/local?retryWrites=true&w=majority`;
let db;
let conn;

async function INIT() {
    try {

        /**
         * @NOTE
         * Creating Singleton for the MONGO DB
         * SInce Mongodb Connection is statefull we don't need to create connection like SQL everytime we query database.
         * We can re-use the single connection throughout the entire lifecycle of application
         * It will improve the throughput and latency for db operations
         * 
         * Since new Mongodb Driver uses unifiedTopology hence we don't need to take care of reconnections and all it is being managed by the driver itself
         * However we can subscribe those events and for those events see the mongodb documentation.
         */

        if (!conn) {

            const client = new MongoClient(url, { useNewUrlParser: true });

            // Database Name
            conn = await client.connect();
            db = client.db(dbName);

            let collection = db.collection('students');
            if (!collection) {
                console.log('Creating Student');
                collection = await db.createCollection('students');
            }

        }
        return db;
    } catch (error) {
        console.log('Error in INIT DATABASE : ', error);
        throw error;
    }
}


module.exports = {
    INIT: INIT
};
