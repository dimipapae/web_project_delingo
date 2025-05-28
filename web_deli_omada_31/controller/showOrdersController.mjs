import { getDbConnection } from '../model/database.js';

export const showUserOrders = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const db = await getDbConnection();

  try {
    const email = req.session.user.email;

    // Παίρνουμε όλες τις παραγγελίες του χρήστη με τα στοιχεία καταστήματος
    const orders = await db.all(`
      SELECT 
        P.kodikos AS orderId,
        P.hmer_ora AS datetime,
        K.onoma AS storeName,
        K.eikona AS storeImage
      FROM PARAGGELIA P
      JOIN KATASTHMA K ON P.kodikos_katasthmatos = K.kodikos
      WHERE P.email_pelath = ?
      ORDER BY P.hmer_ora DESC
    `, [email]);

    // Για κάθε παραγγελία, φέρε τα είδη της
    for (const order of orders) {
      const items = await db.all(`
        SELECT E.onoma AS itemName, PE.posothta
        FROM PAR_PERIL_EIDOS PE
        JOIN EIDOS E ON PE.kodikos_eidous = E.kodikos
        WHERE PE.kodikos_paraggelias = ?
        `, [order.orderId]);

        // Κράτα και την ποσότητα
        order.items = items.map(i => `${i.posothta}x ${i.itemName}`);

        order.storeImage = `/images/${order.storeImage}`;

    }

    res.render('orders', {
      title: 'Οι Παραγγελίες μου',
      orders
    });
  } catch (err) {
    console.error('Σφάλμα εμφάνισης παραγγελιών:', err);
    res.status(500).send('Σφάλμα φόρτωσης παραγγελιών');
  } finally {
    await db.close();
  }
};
