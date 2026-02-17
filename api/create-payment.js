export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: "amount or orderId missing" });
    }

    const response = await fetch(
      "https://api.maxelpay.com/v1/prod/merchant/order/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MAXELPAY_API_SECRET}`
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: amount,
          currency: "USDT",
          success_url: "https://greenleaf.website/payment-success",
          cancel_url: "https://greenleaf.website/payment-failed"
        })
      }
    );

    const data = await response.json();

    if (!data?.data?.checkout_url) {
      return res.status(500).json({ error: "Checkout URL not received", data });
    }

    return res.status(200).json({
      payment_url: data.data.checkout_url
    });

  } catch (err) {
    return res.status(500).json({ error: "Payment creation failed" });
  }
}
