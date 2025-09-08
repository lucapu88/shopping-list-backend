import express from 'express';
import { corsConfig } from './config/cors.js';
import { generateRecipe } from './controllers/recipeController.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(corsConfig);
app.use(express.json());

app.post('/generate-recipe', generateRecipe);

export default app;


/* IDEE FUTURE:
    - gestione delle lingue: la mia app nel frontend ha oltre italiano anche inglese e spagnolo.
    - come spunto si potrebbe inserire un input successivo dove l'agente chiede se deve usare per forza tutti gli ingreedienti o meno.
    - magari si aggiunge la possibilità di scegliere quali ingredienti usare.
    - si potrebbe aggiungere una richiesta dell'agente, in caso di poca roba in lista, se può improvvisare aggiungendo altro.
*/