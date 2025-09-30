const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');
require('dotenv').config();

const MONGO_URL = 'mongodb://127.0.0.1/wanderlust'
main()
    .then(() => { console.log('Connected to DB'); })
    .catch(err => { console.log(err); });

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Data has been added to the database');

}
initDB();