export const icons = [
    { name: 'sushi', emojyCode: 0x1F363 },
    { name: 'gelato', emojyCode: 0x1F366 },
    { name: 'biscotti', emojyCode: 0x1F36A },
    { name: 'torta', emojyCode: 0x1F382 },
    { name: 'cioccolata', emojyCode: 0x1F36B },
    { name: 'cocktail', emojyCode: 0x1F379 },
    { name: 'pasta', emojyCode: 0x1F35D },
    { name: 'insalata', emojyCode: 0x1F957 },
    { name: 'frittata', emojyCode: 0x1F958 },
    { name: 'uovo', emojyCode: 0x1F373 },
    { name: 'toast', emojyCode: 0x1F96A },
    { name: 'panino', emojyCode: 0x1F354 },
    { name: 'pizza', emojyCode: 0x1F355 },
    { name: 'carne', emojyCode: 0x1F969 },
    { name: 'pollo', emojyCode: 0x1F357 },
    { name: 'formaggio', emojyCode: 0x1F9C0 },
    { name: 'vegetali', emojyCode: 0x1F96C },
    { name: 'pesce', emojyCode: 0x1F41F },
    { name: 'crostacei', emojyCode: 0x1F99E },
    { name: 'molluschi', emojyCode: 0x1F419 },
    { name: 'default', emojyCode: 0x1f37d },
];

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