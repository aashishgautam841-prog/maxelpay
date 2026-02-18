import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  try {
    const { amount, orderId, email, name } = req.body;

    const secret = process.env.MAXELPAY_API_SECRET;
    const apiKey = process.env.MAXELPAY_API_KEY;

    const timestamp = Math.floor(Date.now() / 1000);

    const payload = {
      orderID: orderId,
      amount: amount,
      currency: "USD",
      timestamp: timestamp,
      userName: name,
      siteName: "GreenLeaf",
      userEmail: email,
      redirectUrl: "https://greenleaf.website/payment-success",
      websiteUrl: "https://greenleaf.website",
      cancelUrl: "https://greenleaf.website/payment-failed",
      webhookUrl: "https://greenleaf.website/api/webhook"
    };

    const key = CryptoJS.enc.Utf8.parse(secret);
    const iv = CryptoJS.enc.Utf8.parse(secret.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    ).toString();

    const response = await fetch(
      "https://api.maxelpay.com/v1/prod/merchant/order/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({ data: encrypted })
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
