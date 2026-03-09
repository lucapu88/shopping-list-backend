import { RecipeService } from '../services/recipeService.js';
import { IconService } from '../services/iconService.js';

export const generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;
        const apiKey = process.env.API_KEY;

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