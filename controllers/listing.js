const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    let { category } = req.query;
    console.log(category)
    let allListings = null;
    if (category && category !== "All") {
       allListings = await Listing.find({ category: category })

    }
    else {
         allListings = await Listing.find()
    }
    console.log(allListings)
    return res.render("./listings/index.ejs", { allListings })
}
//new route
module.exports.renderNewForm = (req, res) => {
    const categoryOptions = Listing.schema.path("category").enumValues;
    res.render("listings/new.ejs", { categoryOptions })
}
//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
    }).populate("owner");
    if (listing.geometry.coordinates.length === 0) {
        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();
        listing.geometry = response.body.features[0].geometry
    }
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings")
    }

    res.render("./listings/show.ejs", { listing })
}
//add listing 
module.exports.addListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    let url = req.file.path
    let filename = req.file.filename;
    let add = new Listing(req.body.listing);
    add.owner = req.user._id;
    add.image = { url, filename }
    add.geometry = response.body.features[0].geometry;
    await add.save();
    console.log(add)
    req.flash("success", "New Listing Created")
    res.redirect("/listings")

}
//edit listing
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    let originalImage = listing.image.url;
    originalImageUrl = originalImage.replace("/upload", "/upload/w_250")
    res.render("./listings/edit.ejs", { listing, originalImageUrl })
}
//update listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let nowbody = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, { ...nowbody });
    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Updated Successfully");
    res.redirect("/listings")

}
//delete listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("error", "deleted successfully")
    res.redirect("/listings")
}
//search Listing

module.exports.searchListing = async (req, res) => {
    let { q } = req.query
    let all = await Listing.find({}).select('title -_id')
    let matching = null;
    for (let check of all) {
        if (q.toUpperCase() == check.title.toUpperCase() || q.toLowerCase() == check.title.toLowerCase()) {
            matching = check.title
        }
    }
    if (!matching) {
        req.flash("error", "Please search in existing listings ");
        return res.redirect("/listings")
    }
    let listing = await Listing.find({ title: matching });
    listing = listing[0]
    if (listing.geometry.coordinates.length === 0) {
        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();
        listing.geometry = response.body.features[0].geometry
    }
    return res.render("./listings/show.ejs", { listing })
}