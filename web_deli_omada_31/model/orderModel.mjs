import { getDbConnection } from './database.js';

export async function createOrder(kodikos, hmer_ora, tropos, shopId, email) {
  const db = await getDbConnection();
  await db.run(`
    INSERT INTO PARAGGELIA (kodikos, hmer_ora, tropos_pliromhs, kodikos_katasthmatos, email_pelath)
    VALUES (?, ?, ?, ?, ?)`,
    [kodikos, hmer_ora, tropos, shopId, email]
  );
}

export async function addOrderItems(kodikosParaggelias, items) {
  const db = await getDbConnection();

  for (const [kodikosEidous, item] of Object.entries(items)) {
    if (item.qty > 0) {
      await db.run(`
        INSERT INTO PAR_PERIL_EIDOS (posothta, kodikos_paraggelias, kodikos_eidous)
        VALUES (?, ?, ?)`,
        [item.qty, kodikosParaggelias, kodikosEidous]
      );
    }
  }
}
