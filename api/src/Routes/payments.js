const server = require("express").Router();
const { STRIPE_SECRET_KEY, MY_DOMAIN } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);

server.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'FindDevs verification',
                        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1024px-Twitter_Verified_Badge.svg.png'],
                    }
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${MY_DOMAIN}/success`,
        cancel_url: `${MY_DOMAIN}/user/username`,
    });
    res.json({ id: session.id });
});

module.exports = server;