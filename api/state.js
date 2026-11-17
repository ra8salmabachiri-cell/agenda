// Funció serverless de Vercel: llegeix i desa l'estat de l'agenda a Neon.
// Variables d'entorn necessàries a Vercel: DATABASE_URL i AGENDA_TOKEN.
const { neon } = require('@neondatabase/serverless');
const { timingSafeEqual } = require('crypto');

function authorized(req) {
  const expected = process.env.AGENDA_TOKEN || '';
  const header = req.headers.authorization || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.DATABASE_URL || !process.env.AGENDA_TOKEN) {
    return res.status(500).json({ error: 'Falten variables d\'entorn al servidor' });
  }
  if (!authorized(req)) return res.status(401).json({ error: 'No autoritzat' });

  const sql = neon(process.env.DATABASE_URL);
  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM agenda_state WHERE id = 'main'`;
      return res.status(200).json({ data: rows[0] ? rows[0].data : null });
    }
    if (req.method === 'PUT') {
      const data = req.body && req.body.data;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Dades no vàlides' });
      }
      await sql`
        INSERT INTO agenda_state (id, data, updated_at)
        VALUES ('main', ${JSON.stringify(data)}::jsonb, now())
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Mètode no permès' });
  } catch (e) {
    return res.status(500).json({ error: 'Error de base de dades' });
  }
};
