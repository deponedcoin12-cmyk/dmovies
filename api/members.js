const { connectDB, Member, Wateja } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  const path = req.url.split('?')[0];

  // ---- WATEJA ----
  if (path.includes('/wateja')) {
    if (req.method === 'GET') {
      const { tarehe } = req.query;
      const filter = tarehe ? { tarehe } : {};
      const wateja = await Wateja.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, wateja });
    }
    if (req.method === 'POST') {
      const w = await Wateja.create(req.body);
      return res.json({ success: true, wateja: w });
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Wateja.findByIdAndDelete(id);
      return res.json({ success: true });
    }
  }

  // ---- MEMBERS ----
  if (req.method === 'GET') {
    const members = await Member.find().sort({ createdAt: -1 });
    return res.json({ success: true, members });
  }

  if (req.method === 'POST') {
    const { jina, simu, tier, movies: mv } = req.body;
    const count = await Member.countDocuments();
    const memberId = 'DM' + String(count + 1).padStart(4, '0');
    const member = await Member.create({
      memberId, jina, simu, tier,
      movies: mv || 0,
      points: (mv || 0) * 10,
      tarehe: new Date().toLocaleDateString('sw'),
    });
    return res.json({ success: true, member });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Member.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
