import { carbohydrateType } from '../types/FoodType';

export function validateInput(amount: number, from: string, to: string): { fromFood: carbohydrateType; toFood: carbohydrateType } {
    if (isNaN(amount)) throw new Error('Per favore, fornisci un numero valido come argomento.');

    const validFoods: carbohydrateType[] = ['pasta', 'riso', 'farro', 'orzo', 'cereali', 'pane', 'patate', 'friselle', 'crostini', 'crackers'];

    if (!validFoods.includes(from as carbohydrateType)) throw new Error(`Tipo di cibo non valido: ${from}`);
    if (!validFoods.includes(to as carbohydrateType)) throw new Error(`Tipo di cibo non valido: ${to}`);

    return { fromFood: from as carbohydrateType, toFood: to as carbohydrateType };
}