const mongoose = require('mongoose');
require('dotenv').config();

// Use the real models, not a second schema
const Accommodation = require('./models/Accommodation');
const User = require('./models/User');

// Start of every Cloudinary image link
// w_1200,q_auto,f_auto makes the pictures smaller so the pages load faster
const BASE = 'https://res.cloudinary.com/r3t5x7j7/image/upload/w_1200,q_auto,f_auto/';

// The six listings
// images: first one is the big picture, the next four are the small ones
const sampleListings = [
  {
    title: 'Paris, France',
    type: 'Entire home',
    location: 'Paris, France',
    description: 'Stay in the heart of Paris in this stunning home close to popular attractions and equipped with all modern amenities.',
    pricePerNight: 400,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: [
      'wifi', 'kitchen', 'free parking', 'washer', 'dryer', 'air conditioning',
      'heating', 'TV', 'hair dryer', 'iron', 'coffee machine', 'balcony', 'elevator', 'smoke alarm'
    ],
    rating: 4.7,
    reviews: 250,
    enhancedCleaning: true,
    selfCheckIn: true,
    images: [
      BASE + 'Paris/1.jpg',
      BASE + 'Paris/-2.jpg',
      BASE + 'Paris/-3.jpg',
      BASE + 'Paris/-4.jpg',
      BASE + 'Paris/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Paris/-6.jpg', caption: 'Bright bedroom with a comfortable queen bed.' }
  },
  {
    title: 'Mauritius',
    type: 'Luxury Villa',
    location: 'Mauritius',
    description: 'Experience paradise in this luxurious villa featuring a private pool and breathtaking ocean views.',
    pricePerNight: 550,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    amenities: [
      'wifi', 'kitchen', 'private pool', 'free parking', 'air conditioning', 'ocean view',
      'beach access', 'outdoor shower', 'BBQ grill', 'washer', 'TV', 'hair dryer', 'security cameras', 'garden'
    ],
    rating: 4.9,
    reviews: 190,
    enhancedCleaning: true,
    selfCheckIn: false,
    images: [
      BASE + 'Mauritius/1.jpg',
      BASE + 'Mauritius/-2.jpg',
      BASE + 'Mauritius/-3.jpg',
      BASE + 'Mauritius/-4.jpg',
      BASE + 'Mauritius/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Mauritius/-6.jpg', caption: 'Spacious bedroom with a king bed and sea breeze.' }
  },
  {
    title: 'Cape Town, South Africa',
    type: 'Entire apartment',
    location: 'Cape Town, South Africa',
    description: 'Stay in a modern apartment close to vibrant beaches and top dining spots with incredible scenic views.',
    pricePerNight: 320,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      'wifi', 'kitchen', 'free parking', 'ocean view', 'washer', 'dryer',
      'air conditioning', 'TV', 'balcony', 'workspace', 'hair dryer', 'iron', 'smoke alarm', 'security cameras'
    ],
    rating: 4.8,
    reviews: 310,
    enhancedCleaning: true,
    selfCheckIn: true,
    images: [
      BASE + 'Cape-Town/1.jpg',
      BASE + 'Cape-Town/-2.jpg',
      BASE + 'Cape-Town/-3.jpg',
      BASE + 'Cape-Town/-4.jpg',
      BASE + 'Cape-Town/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Cape-Town/-6.jpg', caption: 'Comfortable bedroom with a view of the ocean.' }
  },
  {
    title: 'Bali, Indonesia',
    type: 'Private villa',
    location: 'Bali, Indonesia',
    description: 'Relax in a tranquil private villa surrounded by lush tropical greenery and modern comforts.',
    pricePerNight: 210,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      'wifi', 'kitchen', 'private pool', 'air conditioning', 'garden view', 'outdoor lounge',
      'breakfast included', 'washer', 'TV', 'hair dryer', 'free parking', 'mosquito nets', 'security cameras'
    ],
    rating: 4.6,
    reviews: 215,
    enhancedCleaning: false,
    selfCheckIn: true,
    images: [
      BASE + 'Bali/1.jpg',
      BASE + 'Bali/-2.jpg',
      BASE + 'Bali/-3.jpg',
      BASE + 'Bali/-4.jpg',
      BASE + 'Bali/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Bali/-6.jpg', caption: 'Quiet bedroom with wooden finishes and a garden view.' }
  },
  {
    title: 'Montreal, Canada',
    type: 'Entire apartment',
    location: 'Montreal, Canada',
    description: 'Cozy and stylish apartment in downtown Montreal near historic landmarks and vibrant culture.',
    pricePerNight: 180,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      'wifi', 'kitchen', 'heating', 'washer', 'dryer', 'air conditioning',
      'TV', 'workspace', 'coffee machine', 'hair dryer', 'iron', 'elevator', 'smoke alarm'
    ],
    rating: 4.5,
    reviews: 140,
    enhancedCleaning: true,
    selfCheckIn: false,
    images: [
      BASE + 'Montreal/1.jpg',
      BASE + 'Montreal/-2.jpg',
      BASE + 'Montreal/-3.jpg',
      BASE + 'Montreal/-4.jpg',
      BASE + 'Montreal/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Montreal/-6.jpg', caption: 'Warm bedroom with a comfortable double bed.' }
  },
  {
    title: 'Tokyo, Japan',
    type: 'Private room',
    location: 'Tokyo, Japan',
    description: 'Comfortable private room in a peaceful neighborhood with easy access to public transport.',
    pricePerNight: 150,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      'wifi', 'kitchen', 'air conditioning', 'heating', 'washer', 'TV',
      'hair dryer', 'iron', 'workspace', 'smoke alarm', 'near subway', 'luggage storage'
    ],
    rating: 4.2,
    reviews: 180,
    enhancedCleaning: true,
    selfCheckIn: true,
    images: [
      BASE + 'Tokyo/1.jpg',
      BASE + 'Tokyo/-2.jpg',
      BASE + 'Tokyo/-3.jpg',
      BASE + 'Tokyo/-4.jpg',
      BASE + 'Tokyo/-5.jpg'
    ],
    sleepingImage: { url: BASE + 'Tokyo/-6.jpg', caption: 'Simple, minimalist bedroom with a floor bed.' }
  }
];

// The email typed after "node seed.js" decides which user owns the listings.
// When no email is given, the first user in the database is used instead.
const hostEmail = process.argv[2];

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
    console.log('Connected to MongoDB...');

    // Find the host for the listings
    const host = hostEmail
      ? await User.findOne({ email: hostEmail.toLowerCase() })
      : await User.findOne();

    if (!host) {
      console.log('User not found. Register or log in first, then check the email you typed.');
      return;
    }

    // Delete every existing listing so the six samples are not added twice
    await Accommodation.deleteMany({});

    // Add the host to each listing, then save them all
    const listingsWithHost = sampleListings.map((listing) => ({ ...listing, host: host._id }));
    await Accommodation.insertMany(listingsWithHost);
    console.log(`Seeded 6 listings for ${host.email}!`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection whether it worked or not
    mongoose.connection.close();
  }
};

seedDB();
