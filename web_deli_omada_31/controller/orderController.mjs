import { createOrder, addOrderItems } from '../model/orderModel.mjs';


export async function handleOrderSubmission(req, res) {
    console.log('Session user:', req.session.user);
    console.log('Session shopId:', req.session.shopId);


  const { troposPliromis, items } = req.body;

  const email = req.session.user?.email;

  const shopId = req.session.shopId;

   //if (!email || !shopId) return res.status(400).send("Λείπει email ή κατάστημα");

    if (!email) {
    return res.status(401).json({
      message: 'Μη περιμένεις άλλο! Γίνε μέλος και βάλε τέλος στην πείνα σου τώρα!'
    });
    }

  if (!shopId) {
    return res.status(400).json({ message: 'Λείπει κατάστημα.' });
  }


  const kodikosParaggelias = `PAR-${Date.now()}`;
  const hmer_ora = new Date().toISOString();

  try {
    await createOrder(kodikosParaggelias, hmer_ora, troposPliromis, shopId, email);
    await addOrderItems(kodikosParaggelias, items);
    res.status(200).send("Η παραγγελία καταχωρήθηκε");
  } catch (err) {
    console.error("Σφάλμα καταχώρησης παραγγελίας:", err);
    res.status(500).send("Σφάλμα κατά την καταχώρηση παραγγελίας");
  }
}

