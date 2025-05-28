import { getMenuByShopId, getShopById } from '../model/menuModel.mjs';

export async function showMenuByShop(req, res) {
  const shopId = req.params.shopId;
  req.session.shopId = shopId;

  try {
    const [menuItems, shopInfo] = await Promise.all([
      getMenuByShopId(shopId),
      getShopById(shopId),
    ]);

    // Ομαδοποίηση κατά υποκατηγορία
    const groupedMenu = {};
    for (const item of menuItems) {
      const ypokathgoria = item.onoma_ypokathgorias;
      if (!groupedMenu[ypokathgoria]) {
        groupedMenu[ypokathgoria] = [];
      }
      groupedMenu[ypokathgoria].push(item);
    }

     console.log('Shop Info:', shopInfo) ;
    res.render('menuView', {
       
      title: 'Μενού Καταστήματος',
      groupedMenu,
      shopName: shopInfo.onoma,
      shopLogo: shopInfo.eikona,
      
      isGuest: req.session.user === null , 
      
      shopId: shopInfo.kodikos,
      userEmail: req.session.user ? req.session.user.email : null,
    });
  } catch (error) {
    console.error('❌ Σφάλμα κατά την ανάκτηση μενού:', error);
    res.status(500).send('Σφάλμα κατά την προβολή μενού καταστήματος.');
  }
}