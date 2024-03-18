require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const uuid = require("uuid").v4;
const router = express.Router();

router.post("/", (req, res) => {
  const { product, token } = req.body;
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
});
module.exports = router;
