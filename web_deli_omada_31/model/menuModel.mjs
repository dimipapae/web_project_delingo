import { getDbConnection } from './database.js';

export async function getMenuByShopId(shopId) {
  const db = await getDbConnection();

  const sql = `
    SELECT 
      EIDOS.kodikos, 
      EIDOS.onoma_ypokathgorias,
      EIDOS.onoma,
      EIDOS.perigrafi,
      EIDOS.timh,
      EIDOS.eikona
    FROM KAT_PAR_EIDOS
    JOIN EIDOS ON KAT_PAR_EIDOS.kodikos_eidous = EIDOS.kodikos
    WHERE KAT_PAR_EIDOS.kodikos_katasthmatos = ?
    ORDER BY EIDOS.onoma_ypokathgorias, EIDOS.onoma
  `;

  return db.all(sql, [shopId]);
}

export async function getShopById(shopId) {
  const db = await getDbConnection();

  const sql = `
    SELECT onoma, eikona , kodikos
    FROM KATASTHMA
    WHERE kodikos = ?
  `;

  return db.get(sql, [shopId]);
}