// const mongoose = require("mongoose")
// const initdata = require("./data.js")
// const Listing = require("../models/listing.js");
// const data = require("./data.js");
// main().then((res) => { console.log("I am good at listening to db") }).catch((err) => { console.log("There is error in db") });
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
// }
// const CATEGORIES = [
//     "Trending",
//     "Rooms",
//     "Camping",
//     "Iconic cities",
//     "Mountains",
//     "Castles",
//     "Amazing pool",
//     "Farms",
//     "Arctic",
//     "Domes"
// ];
// const initDB = async () => {
//     await Listing.deleteMany({})
//     const OWNERID = '6931943fb8d68f6ab8aac0cd'
//     // for (let item of initdata.data) {
//     //     item.image = item.image.url;
//     //     // item.owner = OWNERID
//     // }
//     initdata.data = initdata.data.map((obj,index) => ({ ...obj, owner: OWNERID, category: obj.category || CATEGORIES[index % CATEGORIES.length], }))
//     await Listing.insertMany(initdata.data)
//     console.log("data was initialized")
// }
// initDB()
if (process.env.NODE_ENV != "production") {
require('dotenv').config({ path: '../.env' });

}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;   // MUST be before main()
// console.log(dbUrl)
const CATEGORIES = [
    "Trending",
    "Rooms",
    "Camping",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Amazing pool",
    "Farms",
    "Arctic",
    "Domes"
];

const initDB = async () => {
    await Listing.deleteMany({});
    const OWNERID = '6931943fb8d68f6ab8aac0cd';

    initdata.data = initdata.data.map((obj, index) => ({
        ...obj,
        owner: OWNERID,
        category: obj.category || CATEGORIES[index % CATEGORIES.length],
    }));

    await Listing.insertMany(initdata.data);
    console.log("✅ Data was initialized");
};

async function main() {
    try {
        console.log("🌐 Connecting to MongoDB Atlas...");
        await mongoose.connect(dbUrl);

        console.log("✅ Connected to DB");

        await initDB();   // run seeding AFTER connection

        console.log("🌱 Seeding finished");
    } catch (err) {
        console.log("❌ DB Error:", err.message);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Connection closed");
    }
}

main();     // <--- ONLY this call at bottom
