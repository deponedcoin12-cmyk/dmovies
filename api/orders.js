const { connectDB, Order, Wateja, Member } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await connectDB();

  // GET /api/orders — pata orders zote
  if (req.method === 'GET') {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  }

  // POST /api/orders — unda order mpya
  if (req.method === 'POST') {
    const data = req.body;
    const ref = 'DM' + Date.now().toString().slice(-6);
    const order = await Order.create({ ...data, ref });
    return res.json({ success: true, order });
  }

  // PUT /api/orders — badilisha status ya order
  if (req.method === 'PUT') {
    const { ref, status } = req.body;
    const order = await Order.findOneAndUpdate({ ref }, { status }, { new: true });

    // Ukithibitisha order → ongeza kwenye wateja
    if (status === 'confirmed' && order) {
      await Wateja.create({
        jina: order.jina,
        simu: order.simu,
        pakiti: order.pakiti,
        malipo: order.malipo,
        saa: order.saa,
        bei: order.bei,
        wakati: order.wakati,
        tarehe: order.tarehe,
        fromOrder: order.ref,
      });
      // Ongeza points kwa member
      if (order.simu) {
        await Member.findOneAndUpdate(
          { simu: order.simu },
          { $inc: { movies: 1, points: 10 } }
        );
      }
    }
    return res.json({ success: true, order });
  }

  // DELETE /api/orders?ref=DM123456
  if (req.method === 'DELETE') {
    const { ref } = req.query;
    await Order.findOneAndDelete({ ref });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
