import { carbohydrateType } from '../types/FoodType';
import { CarbohydratesConverter } from './CarbohydratesConverter';
import { MenuSystem } from './MenuSystem';
import { Suggestion } from './Suggestion';

export enum MenuStep {
    WEIGHT = 'WEIGHT',
    FROM_FOOD = 'FROM_FOOD',
    TO_FOOD = 'TO_FOOD',
    RESULT = 'RESULT'
}

export interface AppState {
    weight?: number;
    fromFood?: carbohydrateType;
    toFood?: carbohydrateType;
}

export class InteractiveCLI {
    private menuSystem: MenuSystem;
    private navigationHistory: MenuStep[] = [];
    private currentStep: MenuStep = MenuStep.WEIGHT;
    private appState: AppState = {};

    constructor() {
        this.menuSystem = new MenuSystem();
    }

    public async run(): Promise<void> {
        console.log('🍝 Food Converter - Convertitore Carboidrati\n');

        while (true) {
            this.addToHistory(this.currentStep);
            this.clearScreen();

            try {
                const shouldContinue = await this.handleCurrentStep();
                if (!shouldContinue) {
                    this.showExitMessage();
                    break;
                }
            } catch (error) {
                this.handleError(error);
            }
        }
    }

    private async handleCurrentStep(): Promise<boolean> {
        switch (this.currentStep) {
            case MenuStep.WEIGHT:
                return await this.handleWeightInput();

            case MenuStep.FROM_FOOD:
                return await this.handleFromFoodSelection();

            case MenuStep.TO_FOOD:
                return await this.handleToFoodSelection();

            case MenuStep.RESULT:
                return await this.handleResultDisplay();

            default:
                throw new Error(`Step non gestito: ${this.currentStep}`);
        }
    }

    private async handleWeightInput(): Promise<boolean> {
        const weight = await this.menuSystem.promptForWeight();

        if (weight === 0) {
            return false; // Exit application
        }

        this.appState.weight = weight;
        this.currentStep = MenuStep.FROM_FOOD;
        return true;
    }

    private async handleFromFoodSelection(): Promise<boolean> {
        const availableFoods = CarbohydratesConverter.getCarbohydrateTypes();
        const choice = await this.menuSystem.showFoodMenu(availableFoods, 'Scegli il carboidrato di partenza:');

        if (choice === 0) {
            this.goToPreviousStep();
            return true;
        }

        this.appState.fromFood = availableFoods[choice - 1];
        this.currentStep = MenuStep.TO_FOOD;
        return true;
    }

    private async handleToFoodSelection(): Promise<boolean> {
        const availableFoods = CarbohydratesConverter.getCarbohydrateTypes()
            .filter(food => food !== this.appState.fromFood);

        const choice = await this.menuSystem.showFoodMenu(availableFoods, 'Scegli il carboidrato finale:');

        if (choice === 0) {
            this.goToPreviousStep();
            return true;
        }

        this.appState.toFood = availableFoods[choice - 1];
        this.currentStep = MenuStep.RESULT;
        return true;
    }

    private async handleResultDisplay(): Promise<boolean> {
        const { weight, fromFood, toFood } = this.appState;

        if (!weight || !fromFood || !toFood) {
            throw new Error('Stato incompleto per mostrare il risultato');
        }

        // Calcola conversione
        const convertedAmount = CarbohydratesConverter.convert(weight, fromFood, toFood);

        // Mostra SOLO il risultato (senza suggerimento)
        this.showConversionResult(weight, fromFood, toFood, convertedAmount);

        // Nuovo menu con 3 opzioni
        const userChoice = await this.menuSystem.promptForSuggestionChoice();

        switch (userChoice) {
            case 0: // Esci
                return false;

            case 1: // Nuova conversione
                this.resetState();
                this.currentStep = MenuStep.WEIGHT;
                return true;

            case 2: // Suggerimento personalizzato
                return await this.handleCustomSuggestion(weight, fromFood, toFood, convertedAmount);

            default:
                throw new Error(`Scelta non gestita: ${userChoice}`);
        }
    }

    private async handleCustomSuggestion(
        originalWeight: number,
        fromFood: carbohydrateType,
        toFood: carbohydrateType,
        convertedAmount: number
    ): Promise<boolean> {
        // Mostra carboidrati disponibili (escluso il TO food)
        const availableFoods = CarbohydratesConverter.getCarbohydrateTypes()
            .filter(food => food !== toFood);

        const foodChoice = await this.menuSystem.showFoodMenu(
            availableFoods,
            'Con quale carboidrato vuoi dividere?'
        );

        if (foodChoice === 0) {
            // Torna al menu precedente
            return await this.handleResultDisplay();
        }

        const selectedFood = availableFoods[foodChoice - 1];

        // Chiedi percentuale
        const percentage = await this.menuSystem.promptForPercentage();

        // Calcola conversione per il carboidrato scelto
        const suggestionAmount = CarbohydratesConverter.convert(convertedAmount, toFood, selectedFood);

        // Genera e mostra suggerimento personalizzato
        const customSuggestion = Suggestion.generate({
            originalAmount: convertedAmount,
            from: toFood,
            to: selectedFood,
            convertedAmount: suggestionAmount,
            keepPercentage: (100 - percentage) / 100,
            convertPercentage: percentage / 100
        });

        this.showCustomSuggestion(originalWeight, fromFood, toFood, convertedAmount, customSuggestion);

        // Dopo il suggerimento, chiedi se continuare
        const continueChoice = await this.menuSystem.promptForContinue();

        if (continueChoice) {
            this.resetState();
            this.currentStep = MenuStep.WEIGHT;
        }

        return continueChoice;
    }


    private showConversionResult(
        weight: number,
        from: carbohydrateType,
        to: carbohydrateType,
        convertedAmount: number): void {


        console.log('\n🎯 RISULTATO CONVERSIONE:');
        console.log(`${weight}g di ${from} equivalgono a ${convertedAmount.toFixed(2)}g di ${to}`);
        console.log('\n' + '═'.repeat(50));
    }

    private showCustomSuggestion(originalWeight: number, fromFood: carbohydrateType,
        toFood: carbohydrateType, convertedAmount: number,
        suggestion: string): void {
        this.clearScreen();
        console.log('\n📋 RIEPILOGO COMPLETO:');
        console.log(`Peso originale: ${originalWeight}g di ${fromFood}`);
        console.log(`Convertito in: ${convertedAmount.toFixed(2)}g di ${toFood}`);
        console.log('\n💡 SUGGERIMENTO PERSONALIZZATO:');
        console.log(suggestion);
        console.log('\n' + '═'.repeat(50));
    }



    private goToPreviousStep(): void {
        switch (this.currentStep) {
            case MenuStep.FROM_FOOD:
                this.currentStep = MenuStep.WEIGHT;
                this.appState.fromFood = undefined;
                break;

            case MenuStep.TO_FOOD:
                this.currentStep = MenuStep.FROM_FOOD;
                this.appState.toFood = undefined;
                break;

            case MenuStep.RESULT:
                this.currentStep = MenuStep.TO_FOOD;
                break;
        }
    }

    private addToHistory(step: MenuStep): void {
        this.navigationHistory.push(step);
    }

    private clearScreen(): void {
        console.clear();
        this.showHeader();
    }

    private showHeader(): void {
        console.log('🍝 Food Converter - Convertitore Carboidrati');
        console.log('═'.repeat(50));

        if (this.appState.weight) {
            console.log(`📏 Peso: ${this.appState.weight}g`);
        }
        if (this.appState.fromFood) {
            console.log(`📤 Da: ${this.appState.fromFood}`);
        }
        if (this.appState.toFood) {
            console.log(`📥 A: ${this.appState.toFood}`);
        }

        console.log('');
    }

    private showResults(weight: number, from: carbohydrateType, to: carbohydrateType,
        convertedAmount: number, suggestion: string): void {
        console.log('\n🎯 RISULTATO:');
        console.log(`${weight}g di ${from} equivalgono a ${convertedAmount.toFixed(2)}g di ${to}`);
        console.log('\n💡 SUGGERIMENTO:');
        console.log(suggestion);
        console.log('\n' + '═'.repeat(50));
    }

    private resetState(): void {
        this.appState = {};
        this.navigationHistory = [];
    }

    private showExitMessage(): void {
        console.clear();
        console.log('👋 Grazie per aver usato Food Converter!');
        console.log('Arrivederci!');
    }

    private handleError(error: any): void {
        console.error(`❌ Errore: ${error.message}`);
        console.log('Premi Invio per continuare...');
        // Qui potresti aggiungere readline per aspettare input
    }

    // Metodi di debug/utility
    public getNavigationHistory(): MenuStep[] {
        return [...this.navigationHistory];
    }

    public getCurrentState(): { step: MenuStep; state: AppState } {
        return {
            step: this.currentStep,
            state: { ...this.appState }
        };
    }
}