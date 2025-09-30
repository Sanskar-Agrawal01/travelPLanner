const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require("method-override");
const Listing = require('./models/listing');
const MONGO_URL = 'mongodb://127.0.0.1/wanderlust'
const ejsMate = require('ejs-mate');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));  
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', {listings});
});

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});


app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', {listing});
});

app.post('/listings', async (req, res) => {
    const newlisting = new Listing(req.body);
    await newlisting.save();
    res.redirect(`/listings/${newlisting._id}`);
    console.log(newlisting);
});

app.get('/listings/:id/edit', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
});

app.put('/listings/:id', async (req, res) =>{  
    await Listing.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/listings`);

});
app.get("/listings/:id/delete", async (req, res) => {
       await Listing.findByIdAndDelete(req.params.id);
       res.redirect("/listings");

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
