# Shopping-list Backend 🍳🤖

Questo progetto è nato come esercizio personale per sperimentare con l’intelligenza artificiale, in particolare con gli **agenti AI**.  
Un agente AI, per chi non lo sapesse, è un sistema che utilizza modelli linguistici per ragionare, generare e adattare prompt in modo autonomo, con l’obiettivo di eseguire compiti complessi.

## Obiettivo del progetto

L’idea è nata integrando un agente nella mia [app shopping-list](https://github.com/lucapu88/shopping_list).  
A partire dagli elementi presenti nella lista della spesa, l’agente:

1. Analizza la lista completa.
2. Rimuove ciò che non è commestibile o è potenzialmente dannoso.
3. Genera una **ricetta** basata sugli ingredienti rimasti.

La ricetta viene restituita in formato **JSON**, pronta per essere utilizzata da un altro progetto front-end.

## Funzionalità extra

Per puro divertimento ho aggiunto un secondo agente che:

- Analizza la ricetta creata.
- Identifica l’ingrediente principale.
- In base al nome ottenuto mi permette di associare un’icona (presa da una lista statica personale) alla ricetta stessa.
- L'icona poi la uso nel progetto front-end inserendola in un pulsante.

## Note importanti

Questo progetto **non è in produzione**, è solo un esperimento! L’app è **gratuita** e non ha alcun fine di guadagno, ma le chiamate a OpenAI vengono effettuate tramite un mio token personale a pagamento quindi andrei a perderci, e non voglio ne perderci ne guadagnarci. Vorrei solo imparare.
Lo scopo è divertirmi, imparare restando aggiornato sulla rivoluzione tecnologica portata dall’intelligenza artificiale.
