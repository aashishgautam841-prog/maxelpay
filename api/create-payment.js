export default async function handler(req, res) {
   res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: "Amount or orderId missing" });
    }

    const response = await fetch("https://api.maxelpay.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MAXELPAY_API_KEY}`
      },
      body: JSON.stringify({
        amount: amount,
        currency: "USDT",
        order_id: orderId,
        success_url: "https://greenleaf.website/success",
        cancel_url: "https://grennleaf.website/cancel"
      })
    });

    const data = await response.json();

    if (!data.payment_url) {
      return res.status(500).json({ error: "Payment URL not received" });
    }

    return res.status(200).json({ payment_url: data.payment_url });

  } catch (err) {
    return res.status(500).json({ error: "Payment creation failed" });
  }
}
