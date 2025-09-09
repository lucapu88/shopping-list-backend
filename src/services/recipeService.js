import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { recipeSchema } from '../schemas/recipeSchema.js';
import { createRecipePrompt } from '../config/prompts.js';


export class RecipeService {
    constructor(apiKey) {
        this.llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.5,
            apiKey: apiKey
        }).withStructuredOutput(recipeSchema);
    }

    async generateRecipe(ingredients) {
        const promptTemplate = createRecipePrompt(ingredients);

        const prompt = PromptTemplate.fromTemplate(promptTemplate); //crea un "modello" di prompt a partire dalla tua stringa promptTemplate

        const chain = prompt.pipe(this.llm); // collega il prompt appena creato al modello di linguaggio (LLM). Il metodo .pipe() crea una "catena" (chain) che dice: "prendi l'input, passalo al prompt, e il risultato di quel prompt passalo all'LLM".

        const recipe = await chain.invoke({ ingredients }); // Esegui la catena con gli ingredienti forniti. Il metodo .invoke() avvia il processo, passando gli ingredienti al prompt, che poi li elabora e li invia all'LLM per generare la ricetta.

        return recipe;
    }
}