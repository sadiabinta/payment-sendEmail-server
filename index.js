// server.js
require("dotenv").config();
const express = require("express");
// const bodyParser = require('body-parser');

const cors = require("cors");

const app = express();
const port = 5000;
app.use(
  cors({
    origin: 'https://payment-send-email.vercel.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
// app.use(bodyParser.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
            tax_behavior: "exclusive",
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
          },
          quantity: 1,
        },
      ],
      
      // return_url: 'http://localhost:5173/payment',
      success_url: "https://payment-send-email.vercel.app/payment",
      // cancel_url: "http://localhost:5173",
      // customer_email:req.body.customer_email
    })
    // console.log(customer_details.email);

    // Perform additional actions for a successful payment
    // For example, update your database, send confirmation emails, etc.
    // Your logic here...

    res.json({url:session.url});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/',(req,res)=>{
  res.send('server Running')
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
