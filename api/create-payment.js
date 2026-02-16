export default async function handler(req, res) {

  if (req.method !== "POST") {
    res.status(405).send("Only POST allowed");
    return;
  }

  res.status(200).json({
    message: "Backend is working"
  });
}
