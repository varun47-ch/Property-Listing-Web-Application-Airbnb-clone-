const Listing = require("../models/listing")
//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};
//new route
module.exports.renderNewform = (req, res) => {
  res.render("listings/new");
};
//show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path: "author"
    },
  })
  .populate("owner"); 
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); 
  }
  res.render("listings/show", { listing });
};
//create
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
//edit
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); 
  }
  res.render("listings/edit", { listing });
};
//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);   
};
//delete
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

//index
// Search Listings
module.exports.searchListings = async (req, res) => {
  const { q } = req.query; // get the search query
  if (!q) {
    req.flash("error", "Please enter a search term");
    return res.redirect("/listings");
  }

  // Regex search (case-insensitive) for title, location, or country
  const searchRegex = new RegExp(q, "i");

  const allListings = await Listing.find({
    $or: [
      { title: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { country: { $regex: searchRegex } }
    ]
  });

  if (allListings.length === 0) {
    req.flash("error", "No results found!");
  }

  res.render("listings/index", { allListings });
};


