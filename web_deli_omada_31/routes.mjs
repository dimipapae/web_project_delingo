import express from 'express';
import {
  handleLogin,
  handleSignup,
  showHome
} from './controller/authController.mjs';
import { showCategoryResults } from './controller/categoryController.mjs';
import { getDbConnection } from './model/database.js';
import { showMenuByShop } from './controller/menuController.mjs';
import { handleOrderSubmission } from './controller/orderController.mjs';
import { showUserOrders } from './controller/showOrdersController.mjs';
import { showUserFavorites } from './controller/showFavoritesController.mjs'


const router = express.Router();

router.get('/', (req, res) => {

  const showSplash = !req.session.splashSeen;
  if (showSplash) {
    req.session.splashSeen = true;
  }
  res.render('welcome', { title: 'Deli&Go' , showSplash: true });
});

router.post('/login', handleLogin);
router.post('/signup', handleSignup);
router.get('/home', showHome);


// Εμφάνιση αγαπημένων
router.get('/favorites', showUserFavorites);

// Προσθήκη στα αγαπημένα
router.post('/favorites', async (req, res) => {
  const db = await getDbConnection();
  const user = req.session.user;
  const { shopId } = req.body;

  if (!user) return res.status(403).json({ success: false, error: 'Δεν είστε συνδεδεμένος' });

  try {
    await db.run(
      `INSERT OR IGNORE  INTO PEL_PROTIMA_KAT (email_pelath, kod_katast) VALUES (?, ?)`,
      [user.email, shopId]
    );
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      res.json({ success: false, message: 'Ήδη προστέθηκε' });
    } else {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
});

// Αφαίρεση από αγαπημένα
router.delete('/favorites', async (req, res) => {
  const db = await getDbConnection();
  const user = req.session.user;
  const { shopId } = req.body;

  if (!user) return res.status(403).json({ success: false });

  try {
    await db.run(
      `DELETE FROM PEL_PROTIMA_KAT WHERE email_pelath = ? AND kod_katast = ?`,
      [user.email, shopId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Έλεγχος αν είναι αγαπημένο (για τη φόρτωση καρδιάς)
router.get('/favorites/:shopId', async (req, res) => {
  const db = await getDbConnection();
  const user = req.session.user;
  const shopId = req.params.shopId;

  if (!user) return res.json({ isFavorite: false });

  const row = await db.get(
    `SELECT * FROM PEL_PROTIMA_KAT WHERE email_pelath = ? AND kod_katast = ?`,
    [user.email, shopId]
  );

  res.json({ isFavorite: !!row });
});


router.post('/guest', (req, res) => {
  // 1. Καθαρισμός των session μεταβλητών χωρίς destroy
  req.session.guest = true;
  req.session.user = null; // Εξασφαλίζουμε ότι δεν υπάρχει παλιός χρήστης
  req.session.splashSeen = true;
  req.session.guestArea = null;  // Καθαρίζουμε την περιοχή

  // 2. Απλοποιημένη αποθήκευση
  req.session.save((err) => {
    if (err) {
      console.error('⚠️ Session save error:', err);
      return res.status(500).send('Σφάλμα session');
    }
    console.log('✅ Guest session initialized');
    res.redirect('/home');
    
  });
});


router.post('/guest/area', (req, res) => {
  const { area } = req.body;

  if (!area || typeof area !== 'string') {
    return res.status(400).send('Μη έγκυρη περιοχή');
  }

  req.session.guestArea = area;

  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).send('Σφάλμα αποθήκευσης');
    }

    res.status(200).send('OK');
  });
});

router.get('/orders', showUserOrders);

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Logout error:', err);
    }
    res.redirect('/');
  });
});



router.get('/debugtest', (req, res) => {
  console.log(' Η debug route εκτελέστηκε');
  res.send('OK');
});



router.get('/category/:categoryName', (req, res,next) => {
  console.log('Category route hit!', req.params);
  next();
}, showCategoryResults);

router.get('/menu/:shopId', showMenuByShop); //  route για μενού καταστήματος


router.get('/search', async (req, res) => {
  console.log("➡️ /search hit with query:", req.query.query); // DEBUG
  const query = req.query.query?.trim() ?? '';

  const userArea = req.session.user?.onoma_per || req.session.guestArea;
  console.log(userArea);

  if (!query || query.length < 1) {
    return res.json([]); // επιστρέφουμε άδειο array αν το query είναι μικρό ή άδειο
  }

  try {
    const db = await getDbConnection();

    const stores = await db.all(`
      SELECT K.kodikos AS id, K.onoma AS name, K.eikona AS imageUrl
      FROM KATASTHMA AS K JOIN PER_EXYPHRETEI_KAT AS P ON K.kodikos = P.kodikos_katasthmatos 
      WHERE K.onoma LIKE ?
      AND P.onoma_perioxhs LIKE ? 
    
    `, [`%${query}%` , userArea]);

    // Αν δεν έχει εικόνα, βάζουμε default
    const resultWithDefaults = stores.map(store => ({
      ...store,
      imageUrl: store.imageUrl ? `/images/${store.imageUrl}` : '/images/default.jpg'
    }));

    res.json(resultWithDefaults);
  } catch (err) {
    console.error('Search DB error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submit-order', handleOrderSubmission);



export default router;

