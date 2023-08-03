const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '649a7a4de46f4c9dbf80702a',
            description: 'this is a sample description. The description was hard coded in the seeds/index file.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dvhajlevd/image/upload/v1690972156/YelpCamp/wldiqnvu7khgbdb6gzvu.jpg',
                    fileName: 'YelpCamp/wldiqnvu7khgbdb6gzvu',
                },
                {
                    url: 'https://res.cloudinary.com/dvhajlevd/image/upload/v1690972155/YelpCamp/wvrxozdbmekzqln6aqju.jpg',
                    fileName: 'YelpCamp/wvrxozdbmekzqln6aqju',
                },
                {
                    url: 'https://res.cloudinary.com/dvhajlevd/image/upload/v1690972156/YelpCamp/wfsfdnhjl0rcsrmjb4ut.jpg',
                    fileName: 'YelpCamp/wfsfdnhjl0rcsrmjb4ut',
                }
            ],
            geometry:
            {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
