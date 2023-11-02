import {StatusCodes} from "http-status-codes";
import {PaymentMethod} from '@stripe/stripe-js';
import {Request, Response} from 'express';
import stripe from "../utils/stripeService";
import {chargeToken} from "../utils/checkout";


const YOUR_DOMAIN = 'http://localhost:3000';
interface StripeCheckoutSessionEvent {
    data: {
        object: {
            id: string;
            metadata: {
                uid: string;
                plan: string;
                token: number;
                price: number;
                // Add other metadata fields here
            };
            // Add other relevant fields here
        };
    };
    type: string;
    // Add other fields specific to the event
}

const createCheckoutSession = async (req : Request, res : Response) => {
    const {product, paymentMethodTypes} = req.body;
    const uid = (req.body ?. decoded ?. uid);

    // Convert string payment method names to enum values
    const supportedPaymentMethods = paymentMethodTypes.map((method : any) => {
        if (method === "card" || method === "paypal" || method === "wise") {
            return method as PaymentMethod;
        }
        // You can handle unsupported payment methods here
        return "card"; // Default to card if an unsupported method is specified
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: supportedPaymentMethods,
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.name,
                        description: product.service,
                        metadata: {
                            token: product ?. tokenAmount,
                            uid: uid,
                            plan: product ?. name,
                            price: product ?. price
                        }
                    },
                    unit_amount: product.price * 100
                },
                quantity: product.quantity
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
        metadata: {
            uid: uid,
            plan: product ?. name,
            token: product ?. tokenAmount,
            price: product ?. price
        }
    });

    // res.json({id: session.id});
    if (session.url) {
        res.json({
            url: session.url,
            uid: req.body ?. decoded ?. uid
        });
    } else {
        res.status(500).send("Error creating the checkout session.");
    }
};

const createPortalSession = async (req : Request, res : Response) => {
    try {
        // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
        // Typically, this is stored alongside the authenticated user in your database.
        const {session_id} = req.body;
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        // Ensure that checkoutSession.customer is treated as a string
        const customerID: string = checkoutSession.customer as string;

        // This is the URL to which the customer will be redirected when they are done
        // managing their billing with the portal.
        const returnUrl = YOUR_DOMAIN;

        const portalSession = await stripe.billingPortal.sessions.create({customer: customerID, return_url: returnUrl});

        if (portalSession.url) {
            res.redirect(303, portalSession.url);
        } else {
            throw new Error('Portal Session URL is null.');
        }
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
// You'll need to import your Stripe instance
const webhook = async (req : Request, res : Response) => {
    const event = req.body as StripeCheckoutSessionEvent;

    try { // Verify the event to ensure it came from Stripe
        const signature = req.headers['stripe-signature']!;
        const payload = {
            id: 'evt_test_webhook',
            object: 'event'
        };

        const payloadString = JSON.stringify(payload, null, 2);
        const secret = 'whsec_15ae919e42abe3e23db05dccac7a3643a372d24328018a8f7cca5cca8e58d250';

        const header = stripe.webhooks.generateTestHeaderString({payload: payloadString, secret});

        if (req.body.type === 'checkout.session.completed') {
            const metadata = event.data.object.metadata;

            // Access specific metadata fields
            const uid = metadata.uid;
            const plan = metadata.plan;
            const token = metadata.token;
            const price = metadata.price;
            console.log(plan);


            // Now, you can use userId and productId in your logic
            await chargeToken(uid, plan, token, price);
            // Update user's budget or perform other actions based on metadata
        }

        // Respond with a 200 OK to acknowledge receipt of the event
        res.json({received: true});
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(400).send('Webhook Error');
    }
};

const checkoutController = {
    createCheckoutSession,
    createPortalSession,
    webhook
}

export default checkoutController;
