import { z } from 'zod';

export const recipeSchema = z.object({
    titolo: z.string().describe("Un titolo creativo e accattivante per la ricetta."),
    ingredienti: z.array(z.string()).describe("Una lista di tutti gli ingredienti usati nella ricetta."),
    preparazione: z.string().describe("Una descrizione dettagliata dei passaggi per preparare la ricetta."),
    tempo: z.string().describe("Il tempo totale stimato per preparare la ricetta (es. '30 minuti')."),
    difficolta: z.string().describe("Un livello di difficoltà tra 'facile', 'media', 'difficile'."),
    emoji: z.number().describe("Il codice esadecimale dell'emoji che rappresenta la ricetta.")
});
