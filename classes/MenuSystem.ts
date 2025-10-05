import * as readline from 'readline';
import { carbohydrateType } from '../types/FoodType';

export class MenuSystem {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public async promptForWeight(): Promise<number> {
        while (true) {
            console.log('📏 INSERISCI PESO');
            console.log('0 = Esci');
            console.log('Esempi: 100, 100g, 1.5kg, 2,5kg');
            console.log('─'.repeat(30));
            
            const input = await this.askQuestion('Inserisci il peso: ');
            
            if (input === '0') {
                return 0; // Exit signal
            }
            
            const weight = this.parseWeight(input);
            
            if (weight === null) {
                console.log('❌ Errore: Formato non valido. Usa: 100, 100g, 1.5kg');
                await this.pressEnterToContinue();
                continue;
            }
            
            if (weight <= 0) {
                console.log('❌ Errore: Il peso deve essere positivo');
                await this.pressEnterToContinue();
                continue;
            }
            
            if (weight > 10000) {
                console.log('❌ Errore: Peso troppo elevato (massimo 10kg)');
                await this.pressEnterToContinue();
                continue;
            }
            
            return weight;
        }
    }

    public async showFoodMenu(foods: carbohydrateType[], title: string): Promise<number> {
        while (true) {
            console.log(`🍞 ${title.toUpperCase()}`);
            console.log('0 = Torna indietro');
            console.log('─'.repeat(30));
            
            // Mostra menu numerato
            foods.forEach((food, index) => {
                console.log(`${index + 1} = ${this.capitalize(food)}`);
            });
            
            console.log('─'.repeat(30));
            
            const input = await this.askQuestion('Scegli un\'opzione: ');
            
            try {
                const choice = parseInt(input);
                
                if (isNaN(choice)) {
                    console.log('❌ Errore: Inserisci un numero');
                    await this.pressEnterToContinue();
                    continue;
                }
                
                if (choice === 0) {
                    return 0; // Go back signal
                }
                
                if (choice < 1 || choice > foods.length) {
                    console.log(`❌ Errore: Scegli un numero tra 0 e ${foods.length}`);
                    await this.pressEnterToContinue();
                    continue;
                }
                
                return choice;
                
            } catch (error) {
                console.log('❌ Errore: Input non valido');
                await this.pressEnterToContinue();
            }
        }
    }

    public async promptForSuggestionChoice(): Promise<1 | 2 | 0> {
        console.log('\n🔄 COSA VUOI FARE?');
        console.log('─'.repeat(30));
        console.log('1 = Nuova conversione');
        console.log('2 = Suggerimento personalizzato');
        console.log('0 = Esci');
        console.log('─'.repeat(30));
        
        while (true) {
            const input = await this.askQuestion('Scegli un\'opzione: ');
            
            try {
                const choice = parseInt(input);
                
                if (choice === 1 || choice === 2 || choice === 0) {
                    return choice as 1 | 2 | 0;
                }
                
                console.log('❌ Errore: Scegli 0, 1 o 2');
                
            } catch (error) {
                console.log('❌ Errore: Input non valido');
            }
        }
    }

    public async promptForPercentage(): Promise<number> {
        console.log('\n📊 PERCENTUALE DI DIVISIONE');
        console.log('Inserisci un numero da 1 a 100');
        console.log('Esempio: 30 = 30% del carboidrato scelto + 70% di quello convertito');
        console.log('─'.repeat(50));
        
        while (true) {
            const input = await this.askQuestion('Inserisci percentuale (1-100): ');
            
            try {
                const percentage = parseInt(input);
                
                if (isNaN(percentage)) {
                    console.log('❌ Errore: Inserisci un numero valido');
                    await this.pressEnterToContinue();
                    continue;
                }
                
                if (percentage < 1 || percentage > 100) {
                    console.log('❌ Errore: La percentuale deve essere tra 1 e 100');
                    await this.pressEnterToContinue();
                    continue;
                }
                
                return percentage;
                
            } catch (error) {
                console.log('❌ Errore: Input non valido');
                await this.pressEnterToContinue();
            }
        }
    }

    public async promptForContinue(): Promise<boolean> {
        console.log('\n🔄 VUOI CONTINUARE?');
        console.log('─'.repeat(30));
        console.log('1 = Sì, nuova conversione');
        console.log('0 = No, esci');
        console.log('─'.repeat(30));
        
        while (true) {
            const input = await this.askQuestion('Scegli un\'opzione: ');
            
            try {
                const choice = parseInt(input);
                
                if (choice === 1) {
                    return true;
                }
                
                if (choice === 0) {
                    return false;
                }
                
                console.log('❌ Errore: Scegli 0 o 1');
                
            } catch (error) {
                console.log('❌ Errore: Input non valido');
            }
        }
    }

    private async askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    private async pressEnterToContinue(): Promise<void> {
        await this.askQuestion('\nPremi Invio per continuare...');
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private parseWeight(input: string): number | null {
        const cleanInput = input.trim().toLowerCase();
        
        // Regex per catturare numero + unità opzionale
        const match = cleanInput.match(/^(\d+(?:[.,]\d+)?)\s*(g|gr|grammi?|kg|kilo|chilogrammi?)?$/);
        
        if (!match) {
            return null; // Formato non valido
        }
        
        const numericPart = match[1].replace(',', '.'); // Supporta virgola italiana
        const unit = match[2] || 'g'; // Default grammi se non specificato
        
        const number = parseFloat(numericPart);
        if (isNaN(number)) {
            return null;
        }
        
        // Conversione in grammi
        switch (unit) {
            case 'g':
            case 'gr':
            case 'grammi':
            case 'grammo':
                return number;
                
            case 'kg':
            case 'kilo':
            case 'chilogrammi':
            case 'chilogrammo':
                return number * 1000;
                
            default:
                return null;
        }
    }

    public close(): void {
        this.rl.close();
    }

    // Metodi di utilità per testing/debugging
    public isOpen(): boolean {
        return !this.rl.close;
    }
}