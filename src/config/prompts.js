import { icons } from "../utils/icons.js";

export const createRecipePrompt = (ingredients) => `
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

export const searchIconPrompt = (recipe) => ` 
Titolo: Classificatore icona ricetta → aggiorna campo name

Obiettivo

    Dato questo oggetto ${recipe}, scegli il nome più adatto dall’inventario fornito.

Inventario:

    ${icons.map(icon => icon.name).join(', ')}

Regole di decisione (in quest’ordine)

    Riconoscimento tipo piatto dal titolo/preparazione/ingredienti (usa matching case-insensitive e normalizza gli accenti):
        pizza: “pizza”, “margherita”, “impasto per pizza” → pizza
        pasta: “pasta”, “spaghetti”, “penne”, “rigatoni”, “fusilli”, “tagliatelle”, “linguine”, “tortellini”, “ravioli”, “lasagne”, “gnocchi” → pasta
        sushi: “sushi”, “maki”, “nigiri”, “uramaki”, “sashimi” → sushi
        panino: “panino”, “hamburger”, “burger”, “sandwich” → panino
        toast: “toast”, “club sandwich” → toast
        insalata: “insalata”, “salad”, “poke” (vegetale dominante) → insalata
        frittata: “frittata”, “omelette” → frittata
        uovo: piatti incentrati sull’uovo non assimilabili a frittata (uova strapazzate, uovo al tegamino) → uovo
        cocktail: “cocktail”, “spritz”, “mojito”, “negroni”, “drink” → cocktail
        dessert/dolci:
            Se è un dolce generico (torta, crostata, cheesecake, muffin, cupcake, tiramisù, budino, crema, dolce al cucchiaio): → torta
            Se è chiaramente gelato/sorbetto/granita: → gelato
            Se sono chiaramente biscotti/cookies/cantucci: → biscotti
            Se è centrato su cioccolato/cioccolata calda/tartufi di cioccolato: → cioccolata
        mare:
            crostacei: gamberi, mazzancolle, scampi, aragosta, astice
            molluschi: calamari, totani, seppie, polpo, cozze, vongole
            pesce: tonno, salmone, merluzzo, baccalà, branzino, orata, sgombro, alici/acciughe, pesce spada
        carni terrestri:
            pollo: pollo, tacchino, gallina, pollo arrosto, petto di pollo
            carne (generica): manzo, vitello, maiale, agnello, salsiccia, prosciutto, speck, pancetta, guanciale, carne macinata, ragù

    Se trovi un match chiaro, seleziona il nome corrispondente e salta ai passi finali.

    Se non c’è un match chiaro, scegli in base all’ingrediente prevalente (pesi per ricorrenza e centralità nel titolo/preparazione):
        formaggi (parmigiano, pecorino, mozzarella, gorgonzola, ricotta, burrata, cheddar, formaggio): → formaggio
        verdure/ortaggi/erbe (pomodoro, zucchina, melanzana, peperone, cipolla, carota, spinaci, cavolo, funghi, asparagi, broccoli, lattuga, rucola, patate, legumi, erbe aromatiche): → vegetali
        carni rosse/suine/ovicaprine incl. salsiccia, salumi: → carne
        pollo/tacchino: → pollo
        pesci: → pesce
        crostacei: → crostacei
        molluschi: → molluschi
        uova come ingrediente principale: → uovo

    In caso di parità, scegli il nome più specifico (es. pollo batte carne; crostacei/molluschi battono pesce; formaggio batte vegetali se il piatto ruota intorno al formaggio).

    Se ancora non trovi nulla di adatto: → default

Output

    Restituisci un JSON con un solo campo, "name", che contiene il nome dell'icona. Esempio: {"name": "pasta"}.
    Attieniti solo ai nomi esatti forniti nell'inventario, senza variazioni o aggiunte.`;