import argon2 from 'argon2';
import { getDbConnection } from '../model/database.js';
import { getPelatisByEmail } from '../model/pelatis.mjs';

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const db = await getDbConnection();


  console.log('Submitted email:', email); // 1
  console.log('Submitted password:', password); // 2

  const user = await db.get('SELECT * FROM PELATIS WHERE email = ?', [email]);

  if (user && await argon2.verify(user.password, password)) {
    req.session.guest = false;
    req.session.user = user;
    req.session.save();
    res.redirect('/home');
  } 

  else {
    res.render('welcome', {
      title: 'Deli&Go',
      loginError: 'Λάθος e-mail ή κωδικός πρόσβασης.',
      // showSplash: false,
      showLoginModal: true ,
      splashSeen: true
    });
  }

  await db.close();
};

export const handleSignup = async (req, res) => {
  const {
    signup_name, signup_surname, signup_email,
    signup_password, signup_address, signup_area,
    signup_floor, signup_phone
  } = req.body;

  const db = await getDbConnection();

  try {
    await db.run('BEGIN TRANSACTION');

    await db.run('INSERT OR IGNORE INTO PERIOXH (onoma) VALUES (?)', [signup_area]);

    // Hash του κωδικού
    const hashedPassword = await argon2.hash(signup_password);

    await db.run(
      `INSERT INTO PELATIS (email, password, onoma, eponymo, tilefono, diefthinsi, orofos, onoma_per)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        signup_email, hashedPassword, signup_name,
        signup_surname, signup_phone, signup_address,
        signup_floor, signup_area
      ]
    );

    await db.run('COMMIT');

    res.render('welcome', {
      showLoginModal: true,
      loginError: null,
      signupError: null,
      showSplash: false
    });

  } catch (err) {
    await db.run('ROLLBACK');

    console.error(err);
    res.render('welcome', {
      signupError: 'Σφάλμα κατά την εγγραφή. Ίσως υπάρχει ήδη λογαριασμός με αυτό το email.',
      showSignupModal: true,
      loginError: null,
      showSplash: false
    });
  } finally {
    await db.close();
  }
};

export const showHome = async (req, res) => {

  const patrasAreas = [
    "Αγία Αικατερίνη", "Αγία Βαρβάρα", "Αγία Σοφία", "Αγία Τριάδα",
    "Άγιοι Απόστολοι", "Άγιος Αλέξιος", "Άγιος Ανδρέας", "Άγιος Γεράσιμος",
    "Άγιος Γεώργιος Λάγγουρα", "Άγιος Δημήτριος", "Άγιος Διονύσιος", "Αγυιά",
    "Αμπελόκηποι", "Αναπηρικά Ιτεών", "Άνθεια", "Ανθούπολη", "Αρόη", "Ασύρματος",
    "Βλατερό", "Βουδ", "Γλαράκη", "Γαλαξιδιώτικα", "Γεραναίικα", "Γηροκομείο",
    "Γκαζοχώρι", "Γούβα", "Δάφνες", "Δασύλλιο", "Δεμένικα", "Δεξαμενή", "Διάκου",
    "Δροσιά", "Εβραιομνήματα", "Εγγλέζικα", "Εγλυκάδα", "Εσχατοβούνι", "Ζαβλάνι",
    "Ζαρουχλέικα", "Ιτιές", "Καντριάνικα","Κέντρο" , "Καστελλόκαμπος", "Κλουκινιώτικα",
    "Κόκκινος Μύλος", "Κοτρώνι", "Κουκούλι", "Κούτσα", "Κρητικά", "Κρύα Ιτεών",
    "Κυνηγού", "Κυψέλη", "Λαδόπουλου", "Λεύκα", "Λιαπαίικα", "Λυκοχορός",
    "Μαγουλιανίτικα", "Μακρυγιάννη", "Μαντζαβιναίικα", "Μαρκάτο", "Μαρούδα",
    "Μεταμόρφωση Σωτήρος", "Μπάλα", "Μπεγουλάκι", "Νεάπολη", "Παγώνα",
    "Παναγία Αλεξιώτισσα", "Περιβόλα", "Πόρτες", "Πράτσικα", "Προάστιο",
    "Προφήτης Ηλίας", "Ριγανόκαμπος", "Ρομάντζα", "Σύνορα", "Σαμακιά",
    "Σκαγιοπούλειο", "Σκιόεσσα", "Συχαινά", "Τέρψη", "Ταμπάχανα", "Ταραμπούρα",
    "Τάσι", "Τερψιθέα", "Τζίνη", "Τριτάκη", "Τσιβδί", "Χαλκωματά", "Ψάχου",
    "Ψαροφάι", "Ψηλαλώνια"]

  console.log('Session data:', req.session);

  if (req.session.guest) {
    // Επισκέπτης => Δεν περνάμε email/διεύθυνση
    return res.render('home', {
      title: 'Αρχική',
      showLoginModal: false,
      showSignupModal: false,
      showSplash: false ,
      userEmail: null,
      userAddress: null,
      userArea: req.session.guestArea || null,
      patrasAreas ,
      isGuest: true, 
      
    });
  }

  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    const pelatis = await getPelatisByEmail(req.session.user.email);

    res.render('home', {
      title: 'Αρχική',
      userEmail: pelatis.email,
      userAddress: pelatis.diefthinsi,
      userArea: pelatis.onoma_per
    });
  } catch (err) {
    console.error('Σφάλμα κατά την εμφάνιση του home:', err);
    res.status(500).send('Σφάλμα φόρτωσης σελίδας');
  }
};

