# Food Converter - Convertitore Carboidrati

## Descrizione
Food Converter è un'applicazione interattiva da terminale per convertire equivalenze tra carboidrati basate sui loro valori nutrizionali. Progettato per aiutare cuochi, nutrizionisti e appassionati di cucina a sostituire un tipo di carboidrato con un altro mantenendo l'equilibrio nutrizionale.

## Funzionalità

### 🍝 Conversioni Supportate
- **Pasta, Riso, Farro, Orzo, Cereali** - Equivalenze 1:1
- **Pane** - Conversioni specifiche con altri carboidrati
- **Patate** - Calcoli basati sul contenuto di carboidrati
- **Friselle, Crostini, Crackers** - Prodotti da forno

### 💡 Suggerimenti Personalizzati
- Divisione intelligente delle porzioni (es. 70% pasta + 30% riso)
- Percentuali personalizzabili dall'utente (1-100%)
- Suggerimenti basati sulle conversioni reali

### 🎛️ Interfaccia Interattiva
- Menu numerati per facile navigazione
- Supporto unità di misura (g, kg, grammi, chilogrammi)
- Navigazione "torna indietro" con cronologia degli step
- Clear screen automatico per interfaccia pulita

## Requisiti
- **Node.js** (versione 14 o superiore)
- **TypeScript** per lo sviluppo
- **ts-node** o **tsx** per l'esecuzione

## Installazione

1. **Clona il repository:**
   ```bash
   git clone https://github.com/DNParadox/food_converter.git
   cd food_converter
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

## Utilizzo

### Avvio dell'applicazione
```bash
# Con ts-node
npx ts-node script.ts

# Con tsx (raccomandato)
npx tsx script.ts
```

### Flusso di utilizzo

1. **Inserimento peso:**
   - Esempi: `100`, `100g`, `1.5kg`, `2,5 kg`
   - Supporta virgola italiana come separatore decimale
   - Limite massimo: 10kg

2. **Selezione carboidrato di partenza:**
   - Menu numerato con tutti i carboidrati disponibili
   - `0` per uscire dall'applicazione

3. **Selezione carboidrato finale:**
   - Menu filtrato (esclude quello di partenza)
   - `0` per tornare alla selezione precedente

4. **Visualizzazione risultato:**
   - Conversione precisa con 2 decimali
   - Menu per continuare o generare suggerimenti

5. **Suggerimenti personalizzati (opzionale):**
   - Scegli carboidrato per la divisione
   - Imposta percentuale personalizzata (1-100%)
   - Visualizza suggerimento calcolato

### Esempi di conversione

```
Input: 100g pasta → riso
Output: 100g di pasta equivalgono a 100.00g di riso

Input: 100g pasta → pane  
Output: 100g di pasta equivalgono a 130.00g di pane

Input: 100g pasta → patate
Output: 100g di pasta equivalgono a 400.00g di patate
```

### Esempio suggerimento personalizzato

```
Peso convertito: 130g di pane
Carboidrato scelto: riso
Percentuale: 30%

Suggerimento: "Hai 130g di pane? Potresti fare 91g di pane e 30g di riso."
```

## Architettura del progetto

```
script.ts                 # Entry point
├── classes/
│   ├── InteractiveCLI.ts      # Orchestratore principale
│   ├── MenuSystem.ts          # Gestione input/output utente
│   ├── CarbohydratesConverter.ts # Logica conversioni
│   ├── Suggestion.ts          # Generazione suggerimenti
│   └── NutrientTable.ts       # Classe base per tabelle nutrizionali
├── types/
│   └── FoodType.ts           # Definizioni tipi TypeScript
└── utils/
    └── validateInput.ts      # Utilità validazione
```

### Principi di design
- **Single Responsibility Principle** - Ogni classe ha una responsabilità specifica
- **Separation of Concerns** - Dati separati dalla logica di business
- **State Management** - Tracciamento completo della navigazione utente
- **Type Safety** - TypeScript per prevenire errori a runtime

## Estensibilità

### Aggiungere nuovi carboidrati
Modifica il file `types/FoodType.ts` e aggiungi le conversioni in `CarbohydratesConverter.ts`:

```typescript
// types/FoodType.ts
export type carbohydrateType = 'pasta' | 'riso' | 'quinoa'; // Aggiungi quinoa

// classes/CarbohydratesConverter.ts
quinoa: {
    pasta: 0.9,
    riso: 0.9,
    // altre conversioni...
}
```

### Aggiungere altri nutrienti
Estendi `NutrientTable` per proteine o grassi:

```typescript
export class ProteinTable extends NutrientTable {
    constructor() {
        super([
            { from: 'pollo', to: 'manzo', rate: 1.1 },
            // altre conversioni proteiche...
        ]);
    }
    
    getNutrientName(): string {
        return 'proteine';
    }
}
```

## Sviluppo

### Struttura delle classi

- **`InteractiveCLI`**: Gestisce il flusso principale e lo stato dell'applicazione
- **`MenuSystem`**: Si occupa dell'interfaccia utente (input/output)
- **`CarbohydratesConverter`**: Contiene la logica di conversione tra carboidrati
- **`Suggestion`**: Genera messaggi di suggerimento personalizzabili
- **`NutrientTable`**: Classe base per gestire tabelle di conversione

### Testing
```bash
# Esegui test (quando implementati)
npm test

# Lint del codice
npm run lint
```

## Roadmap

### Funzionalità pianificate
- [ ] Conversioni per proteine e grassi
- [ ] Interfaccia web complementare


## Autore
**DNParadox** - [GitHub](https://github.com/DNParadox)

## Supporto
Per domande, bug report o suggerimenti, apri una [issue](https://github.com/DNParadox/food_converter/issues) su GitHub.