const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI haijawekwa kwenye Environment Variables');
  }
  
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  
  isConnected = true;
}

const MovieSchema = new mongoose.Schema({
  title: String, genre: String, year: Number, lang: String, emoji: String,
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  ref: { type: String, unique: true },
  jina: String, simu: String, malipo: String, member: String, notes: String,
  movies: Array, saa: String, pakiti: String, bei: Number,
  status: { type: String, default: 'pending' },
  wakati: String, tarehe: String,
}, { timestamps: true });

const WatejaSchema = new mongoose.Schema({
  jina: String, simu: String, pakiti: String, malipo: String,
  saa: String, bei: Number, wakati: String, tarehe: String, fromOrder: String,
}, { timestamps: true });

const MemberSchema = new mongoose.Schema({
  memberId: String, jina: String, simu: String, tier: String,
  movies: { type: Number, default: 0 }, points: { type: Number, default: 0 }, tarehe: String,
}, { timestamps: true });

const Movie  = mongoose.models.Movie  || mongoose.model('Movie',  MovieSchema);
const Order  = mongoose.models.Order  || mongoose.model('Order',  OrderSchema);
const Wateja = mongoose.models.Wateja || mongoose.model('Wateja', WatejaSchema);
const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);

module.exports = { connectDB, Movie, Order, Wateja, Member };
