const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require("method-override");
const Listing = require('./models/listing');
const ejsMate = require('ejs-mate');
require('dotenv').config();
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const connectDB = require('./db/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

connectDB();

app.get('/', (req, res) => {
    res.send('Home Page');
});

// All Listings
app.get('/listings', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
}));

// New Listing form
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Listing
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError('Listing not found', 404);
    res.render('listings/show.ejs', { listing });
}));

// Create Listing
app.post(
    '/listings',
     wrapAsync(async (req, res) => {
        if(!req.body){
        throw new ExpressError('Invalid Listing Data', 400);
        }
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
}));

// Edit Listing form
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError('Listing not found', 404);
    res.render('listings/edit.ejs', { listing });
}));

// Update Listing
app.put('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!listing) throw new ExpressError('Listing not found', 404);
    res.redirect(`/listings/${id}`);
}));

// Delete Listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
   // if (!listing) throw new ExpressError('Listing not found', 404);
    res.redirect('/listings');
}));



app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
