import express from 'express';
import Stripe from 'stripe';
import { corsConfig } from './config/cors.js';
import { generateRecipe } from './controllers/recipeController.js';
import { ensureUser, addGenerazioni, useGenerazione, getTransactions } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_LABELS = {
    [process.env.STRIPE_PRICE_100]: { generazioni: 60, label: 'Piano Starter - €1' },
    [process.env.STRIPE_PRICE_200]: { generazioni: 200, label: 'Piano Chef - €2' },
    [process.env.STRIPE_PRICE_600]: { generazioni: 600, label: 'Piano Gourmet - €5' },
};

app.use(corsConfig);
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.post('/generate-recipe', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(403).json({ error: 'Token mancante' });

    const result = await useGenerazione(token);
    if (!result.success) return res.status(403).json({ error: 'Nessuna generazione disponibile' });

    return generateRecipe(req, res);
});

//Route Stripe 
app.post('/create-checkout-session', async (req, res) => {
    const { priceId, planId, token } = req.body;
    if (!priceId || !token) return res.status(400).json({ error: 'priceId e token obbligatori' });
    const plan = PLAN_LABELS[priceId];
    if (!plan) return res.status(400).json({ error: 'Piano non valido' });
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/`,
            cancel_url: `${process.env.CLIENT_URL}/`,
            metadata: { token, planId, generazioni: plan.generazioni, label: plan.label },
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const { token, generazioni, label } = event.data.object.metadata;
        if (token && generazioni) await addGenerazioni(token, parseInt(generazioni), label);
    }
    res.json({ received: true });
});

app.get('/generazioni', async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'token mancante' });
    const user = await ensureUser(token);
    res.json({ generazioni: user.generazioni });
});

app.post('/usa-generazione', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token mancante' });
    try {
        const result = await useGenerazione(token);
        if (!result.success) return res.status(403).json({ error: 'Nessuna generazione disponibile', generazioni: 0 });
        res.json({ success: true, generazioni: result.generazioni });
    } catch (err) {
        console.error('Errore /usa-generazione:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/migra-generazioni', async (req, res) => {
    const { localToken, uid } = req.body;
    if (!localToken || !uid) return res.status(400).json({ error: 'Dati mancanti' });

    try {
        const localUser = await ensureUser(localToken);
        const firebaseUser = await ensureUser(uid);
        const totale = localUser.generazioni + firebaseUser.generazioni;

        if (totale > 0) {
            await supabase
                .from('users')
                .update({ generazioni: totale })
                .eq('token', uid);
        }
        await supabase.from('users').update({ generazioni: 0 }).eq('token', localToken);

        res.json({ success: true, generazioni: totale });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default app;