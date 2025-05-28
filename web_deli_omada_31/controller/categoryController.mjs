

import { getShopsByCategoryAndArea } from '../model/shopsModel.mjs';
import { getPelatisByEmail } from '../model/pelatis.mjs'; 

export async function showCategoryResults(req, res) {
    console.log('🚨 Μπήκα στο showCategoryResults');
  try {

    let userArea = null;

    if (req.session.user && req.session.user.email) {
      const pelatis = await getPelatisByEmail(req.session.user.email);
      userArea = pelatis?.onoma_per || null;
    } else if (req.session.guestArea) {
      userArea = req.session.guestArea;
    } else {
     
      return res.redirect('/'); 
    }

    
    //  Mapping από "πληθυντικό" σε ονομασία βάσης
    const categoryMap = {
      'Σουβλάκια': 'Σουβλάκι',
      'Καφέδες': 'Καφές',
      'Κρέπα': 'Κρέπες',
      'Πίτσες': 'Πίτσα',
      'Μεξικάνικο': 'Μεξικάνικο',
      'Κινέζικο': 'Κινέζικο',
      'Μπέργκερ': 'Burger',
      'Γλυκό': 'Γλυκά'
    };
    const rawCategoryName = req.params.categoryName;
    const categoryName = categoryMap[rawCategoryName] || rawCategoryName;

    //  Debug προσωρινά αν θες
    console.log('User area:', userArea);
    console.log('Category requested:', rawCategoryName, '->', categoryName);

    const katastimata = await getShopsByCategoryAndArea(categoryName, userArea);

    res.render('categoryResults', {
      title: rawCategoryName, 
      categoryName: rawCategoryName,
      katastimata,
      userArea,
      isGuest: req.session.user === null, 
    });
  } catch (error) {
    console.error('Σφάλμα κατά την εμφάνιση κατηγορίας:', error);
    res.status(500).send('Σφάλμα κατά την ανάκτηση δεδομένων.');
  }
}

