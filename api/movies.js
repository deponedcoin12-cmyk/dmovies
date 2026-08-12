const { connectDB, Movie } = require('./db');

const DEFAULT_MOVIES = [
  { title: 'Fast & Furious X', genre: 'Action', year: 2023, lang: 'Kiingereza', emoji: '💥' },
  { title: 'Black Panther: Wakanda Forever', genre: 'Action', year: 2022, lang: 'Kiingereza', emoji: '💥' },
  { title: 'John Wick 4', genre: 'Action', year: 2023, lang: 'Kiingereza', emoji: '💥' },
  { title: 'The Equalizer 3', genre: 'Action', year: 2023, lang: 'Kiingereza', emoji: '💥' },
  { title: 'Extraction 2', genre: 'Action', year: 2023, lang: 'Kiingereza', emoji: '💥' },
  { title: 'Titanic', genre: 'Romance', year: 1997, lang: 'Kiingereza', emoji: '❤️' },
  { title: 'Me Before You', genre: 'Romance', year: 2016, lang: 'Kiingereza', emoji: '❤️' },
  { title: 'Crazy Rich Asians', genre: 'Romance', year: 2018, lang: 'Kiingereza', emoji: '❤️' },
  { title: 'Coming 2 America', genre: 'Comedy', year: 2021, lang: 'Kiingereza', emoji: '😂' },
  { title: 'The Nice Guys', genre: 'Comedy', year: 2016, lang: 'Kiingereza', emoji: '😂' },
  { title: 'Dar Es Salaam Night', genre: 'Bongo', year: 2023, lang: 'Kiswahili', emoji: '🇹🇿' },
  { title: 'Mtoto wa Mama', genre: 'Bongo', year: 2021, lang: 'Kiswahili', emoji: '🇹🇿' },
  { title: 'Familia Yangu', genre: 'Bongo', year: 2023, lang: 'Kiswahili', emoji: '🇹🇿' },
  { title: 'The Lion King', genre: 'Family', year: 2019, lang: 'Kiingereza', emoji: '👨‍👩‍👧' },
  { title: 'Moana 2', genre: 'Family', year: 2024, lang: 'Kiingereza', emoji: '👨‍👩‍👧' },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  if (req.method === 'GET') {
    let movies = await Movie.find().sort({ createdAt: -1 });
    // Kama hakuna movies, weka za default
    if (!movies.length) {
      movies = await Movie.insertMany(DEFAULT_MOVIES);
    }
    return res.json({ success: true, movies });
  }

  if (req.method === 'POST') {
    const movie = await Movie.create(req.body);
    return res.json({ success: true, movie });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Movie.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
