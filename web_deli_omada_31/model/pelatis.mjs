import { getDbConnection } from './database.js';

export async function getPelatisByEmail(email) {
  const db = await getDbConnection();
  
  const query = `
    SELECT email, diefthinsi, onoma_per
    FROM PELATIS
    WHERE email = ?
  `;

  return await db.get(query, [email]);
}
