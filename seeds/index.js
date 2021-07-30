const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=array =>array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i=0;i<300;i++){
        const random1000= Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20+10)
        const camp = new Campground({
            author:'60fbdb74b482334130309e35',
            location:`${cities[random1000].city}, ${cities[random1000].state} `,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque placeat adipisci nihil doloremque at debitis, unde id consectetur suscipit porro autem nulla corrupti consequatur labore, facilis corporis eius delectus recusandae?',
            price:price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/quangcrazy/image/upload/v1627446204/YelpCamp/nglde4cmkwhrvfj4txh8.jpg',
                    filename: 'YelpCamp/nglde4cmkwhrvfj4txh8'
                },
                {
                  url: 'https://res.cloudinary.com/quangcrazy/image/upload/v1627446167/YelpCamp/yha212s6hh6bhx7epfex.jpg',
                  filename: 'YelpCamp/yha212s6hh6bhx7epfex'
                },
                {
                  url: 'https://res.cloudinary.com/quangcrazy/image/upload/v1627446155/YelpCamp/gnepymcgblvhhkc3sz4g.jpg',
                  filename: 'YelpCamp/gnepymcgblvhhkc3sz4g'
                },
            ]
        })
        await camp.save()
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close();
})