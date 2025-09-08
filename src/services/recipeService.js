import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { recipeSchema } from '../schemas/recipeSchema.js';

export class RecipeService {
    constructor(apiKey) {
        this.llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.5,
            apiKey: apiKey
        }).withStructuredOutput(recipeSchema);
    }

    async generateRecipe(ingredients) {
        const promptTemplate = `
            Sei uno chef professionista.

        Il tuo compito è creare una ricetta seguendo queste regole strettissime:

        1. Analizza attentamente la lista di ingredienti ricevuta: ${ingredients}.
                                    - Se ci sono ingredienti NON commestibili per un essere umano, scartali senza usarli.
                                    - Usa ** solo ** gli ingredienti che sono effettivamente commestibili.
                                    - Non devi mai includere ingredienti tossici, droghe, chimici, metalli, o qualsiasi sostanza non alimentare.
                                    - Se dopo aver scartato quelli non commestibili rimangono ingredienti commestibili, crea comunque la ricetta usando solo quelli.
                                    - Se invece non rimane nessun ingrediente commestibile, fornisci un feedback appropriato nel JSON.

        2. Non inventare o aggiungere ingredienti esterni.

        3. Il tuo unico compito è restituire la ricetta richiesta in formato JSON, senza aggiungere altro testo o spiegazioni. 

        4. Salta il campo "emoji" per ora, lo compilerai in un secondo momento.

        5. NON includere il JSON in un blocco di codice. Restituisci SOLO ed ESCLUSIVAMENTE il JSON.
        `;

        const prompt = PromptTemplate.fromTemplate(promptTemplate); //crea un "modello" di prompt a partire dalla tua stringa promptTemplate

        const chain = prompt.pipe(this.llm); // collega il prompt appena creato al modello di linguaggio (LLM). Il metodo .pipe() crea una "catena" (chain) che dice: "prendi l'input, passalo al prompt, e il risultato di quel prompt passalo all'LLM".

        const recipe = await chain.invoke({ ingredients }); // Esegui la catena con gli ingredienti forniti. Il metodo .invoke() avvia il processo, passando gli ingredienti al prompt, che poi li elabora e li invia all'LLM per generare la ricetta.

        return recipe;
    }
}