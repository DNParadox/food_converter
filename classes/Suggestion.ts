import { CarbohydratesConverter } from "./CarbohydratesConverter";
import { carbohydrateType } from '../types/FoodType';


export class Suggestion {
    private amount: number;
    private from: carbohydrateType;
    private to: carbohydrateType;
    private amountToConvert: number;

    constructor(from: carbohydrateType, to: carbohydrateType, amount: number) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.amountToConvert = amount * 0.3;
    }

 
    public getMessage(): string {
        const remainingFromAmount = this.amount * 0.7; // 70% resta in "from"
        const suggestedAmount = CarbohydratesConverter.convert(this.amountToConvert, this.from, this.to);

        return `Hai ${this.amount}g di ${this.from}? 
                Potresti fare ${remainingFromAmount.toFixed(0)}g di ${this.from} e ${suggestedAmount.toFixed(0)}g di ${this.to}.`;
    }

}