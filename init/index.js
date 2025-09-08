const mongoose = require("mongoose");
const data = require("./data.js"); // import sample data
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});

  // add owner field to every object
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("68b6315def130248583b851a"),
  }));

  await Listing.insertMany(data.data);
  console.log("Data was initialized");
};

initDB();
