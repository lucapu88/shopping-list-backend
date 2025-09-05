
import express from 'express';
import cors from 'cors';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { searchIconPrompt, icons } from './variables.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://shopping-list-lc.netlify.app', 'http://localhost:5173'],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(express.json());

const recipeSchema = z.object({
    titolo: z.string().describe("Un titolo creativo e accattivante per la ricetta."),
    ingredienti: z.array(z.string()).describe("Una lista di tutti gli ingredienti usati nella ricetta."),
    preparazione: z.string().describe("Una descrizione dettagliata dei passaggi per preparare la ricetta."),
    tempo: z.string().describe("Il tempo totale stimato per preparare la ricetta (es. '30 minuti')."),
    difficoltà: z.string().describe("Un livello di difficoltà tra 'facile', 'media', 'difficile'."),
    emojy: z.number().describe("Il codice esadecimale dell'emoji che rappresenta la ricetta.")
});

/*  Questa procedura è la procedura classica, ovvero quella che usa la variabile d'ambiente presa da un file .env.
    L'ho messa e commentata per far vedere che le cose le so fare e non le faccio alla carlona.
    Tuttavia non voglio che qualsiasi pinco pallo che vede il mio codice possa usare la mia API key,
    Perciò ho implementato un sistema, seppur bruttino, che prevede che la API key venga passata dal frontend salvandola in localStorage.
*/
//const apiKey = process.env.API_KEY;

app.post('/generate-recipe', async (req, res) => {
    /* IDEE FUTURE:
        - gestione delle lingue: la mia app nel frontend ha oltre italiano anche inglese e spagnolo.
        - come spunto si potrebbe inserire un input successivo dove l'agente chiede se deve usare per forza tutti gli ingreedienti o meno.
        - magari si aggiunge la possibilità di scegliere quali ingredienti usare.
        - si potrebbe aggiungere una richiesta dell'agente, in caso di poca roba in lista, se può improvvisare aggiungendo altro.
    */
    try {
        const { ingredients, apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'Chiave API non fornita.' });
        }

        // PRIMO AGENTE: CREA LA RICETTA
        const llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.5,
            apiKey: apiKey
        }).withStructuredOutput(recipeSchema);

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

        4. Salta il campo "emojy" per ora, lo compilerai in un secondo momento.

        5. NON includere il JSON in un blocco di codice. Restituisci SOLO ed ESCLUSIVAMENTE il JSON.
        `;

        const prompt = PromptTemplate.fromTemplate(promptTemplate); //crea un "modello" di prompt a partire dalla tua stringa promptTemplate

        const chain = prompt.pipe(llm); // collega il prompt appena creato al modello di linguaggio (LLM). Il metodo .pipe() crea una "catena" (chain) che dice: "prendi l'input, passalo al prompt, e il risultato di quel prompt passalo all'LLM".

        const recipe = await chain.invoke({ ingredients }); // Esegui la catena con gli ingredienti forniti. Il metodo .invoke() avvia il processo, passando gli ingredienti al prompt, che poi li elabora e li invia all'LLM per generare la ricetta.

        // SECONDO AGENTE: SCEGLI L'ICONA
        const llmEmoji = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.1,
            apiKey: apiKey,
            modelKwargs: { response_format: { type: "json_object" } }
        });

        const emojiResponse = await llmEmoji.invoke(searchIconPrompt(JSON.stringify(recipe)));

        const parserEmoji = new JsonOutputParser(); // Crea un parser per estrarre il JSON dalla risposta dell'LLM
        const emojiNameResult = await parserEmoji.invoke(emojiResponse.content);
        const iconsArray = icons;
        const selectedIcon = iconsArray.find(icon => icon.name === emojiNameResult.name);

        recipe.emojy = selectedIcon ? selectedIcon.emojyCode : 0x1f37d;

        console.log("Generated Recipe:", recipe);
        res.json(recipe);
    } catch (err) {
        console.error('Errore durante la generazione della ricetta:', err);
        // La gestione degli errori è più robusta con l'output parser
        res.status(500).json({ error: 'Errore nel parsing della risposta JSON dalla LLM.', details: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
