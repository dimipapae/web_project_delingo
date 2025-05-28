import { getDbConnection } from './database.js';

export async function getShopsByCategoryAndArea(categoryName, userArea) {
  const db = await getDbConnection();

  //  Debug
  console.log("🔍 categoryName:", categoryName);
  console.log('🔍 userArea:', userArea);
  const sql = `
    SELECT DISTINCT KATASTHMA.kodikos, KATASTHMA.onoma, KATASTHMA.diefthinsi, KATASTHMA.eikona 
    FROM KATASTHMA
    JOIN PER_EXYPHRETEI_KAT ON KATASTHMA.kodikos = PER_EXYPHRETEI_KAT.kodikos_katasthmatos
    JOIN KAT_PAR_EIDOS ON KATASTHMA.kodikos = KAT_PAR_EIDOS.kodikos_katasthmatos
    JOIN EIDOS ON KAT_PAR_EIDOS.kodikos_eidous = EIDOS.kodikos
    WHERE PER_EXYPHRETEI_KAT.onoma_perioxhs = ?
    AND EIDOS.onoma_kathgorias = ?
  `;

  // Χειροκίνητο log για επιβεβαίωση
  console.log('🔍 Executing SQL with params:', [userArea, categoryName]);

  return db.all(sql, [userArea, categoryName]);
}