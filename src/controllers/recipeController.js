import { RecipeService } from '../services/recipeService.js';
import { IconService } from '../services/iconService.js';

export const generateRecipe = async (req, res) => {
    /*  So che l'APIKEY va preso da un file .env, e in questo progetto ho impostato anche questa metodologia => const apiKey = process.env.API_KEY;
        So anche come si setta direttamente l'apikey privata su Render (che è quello che uso per deployare il progetto).
        Tuttavia non voglio che chiunque conosce l’URL può fare richieste (anche con curl o Postman).
        Per questo motivo ho creato un semplice input lato frontend dove si inserisce la chiave e la salva in locale. 
        Ma lo vedo solo io poichè il progetto frontend utilizza l'url in un app per android, mentre io uso l'url sul mio iphone da browser.
        Quindi comunque sia NESSUNO potrà mai averla perchè la uso solo sul mio smartphone.
    */
    try {
        const { ingredients, apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'Chiave API non fornita.' });
        }

        // PRIMO AGENTE: CREA LA RICETTA
        const recipeService = new RecipeService(apiKey);
        const recipe = await recipeService.generateRecipe(ingredients);

        // SECONDO AGENTE: SCEGLI L'ICONA
        const iconService = new IconService(apiKey);
        const selectedIcon = await iconService.selectIcon(recipe);

        recipe.emoji = selectedIcon ? selectedIcon.emojiCode : 0x1f37d;

        console.log("Generated Recipe:", recipe);
        res.json(recipe);
    } catch (err) {
        console.error('Errore durante la generazione della ricetta:', err);
        // La gestione degli errori è più robusta con l'output parser
        res.status(500).json({ error: 'Errore nel parsing della risposta JSON dalla LLM.', details: err.message });
    }
};