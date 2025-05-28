import { getDbConnection } from '../model/database.js';

export async function showUserFavorites(req, res) {
  if (!req.session.user) {
    return res.redirect('/home');
  }

  const db = await getDbConnection();
  const favorites = await db.all(`
    SELECT K.kodikos, K.onoma, K.eikona
    FROM KATASTHMA K
    JOIN PEL_PROTIMA_KAT P ON P.kod_katast = K.kodikos
    WHERE P.email_pelath = ?
  `, [req.session.user.email]);

  res.render('favoritesView', { title: 'Αγαπημένα Καταστήματα', shops: favorites });
}
