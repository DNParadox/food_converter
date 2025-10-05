import { carbohydrateType } from '../types/FoodType';

export class CarbohydratesConverter {
    private static conversionRates: { [key in carbohydrateType]?: { [key in carbohydrateType]?: number } } = {
        pasta: {
            riso: 1,
            farro: 1,
            orzo: 1,
            cereali: 1,
            friselle: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        },
        pane: {
            pasta: 0.77,
            riso: 0.77,
            farro: 0.77,
            orzo: 0.77,
            cereali: 0.77,
            friselle: 0.77,
            crostini: 0.77,
            patate: 3,
            crackers: 0.5
        },
        patate: {
            pasta: 0.25,
            riso: 0.25,
            farro: 0.25,
            orzo: 0.25,
            cereali: 0.25,
            friselle: 0.25,
            crostini: 0.25,
            pane: 0.33
        },
        friselle: {
            pasta: 1,
            riso: 1,
            farro: 1,
            orzo: 1,
            cereali: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        },
        crostini: {
            pasta: 1,
            riso: 1,
            farro: 1,
            orzo: 1,
            cereali: 1,
            friselle: 1,
            pane: 1.3,
            patate: 4
        },
        crackers: {
            pane: 2,
            pasta: 2.6,
            riso: 2.6,
            farro: 2.6,
            orzo: 2.6,
            cereali: 2.6,
            friselle: 2.6,
            crostini: 2.6,
            patate: 8
        },
        riso: {
            pasta: 1,
            farro: 1,
            orzo: 1,
            cereali: 1,
            friselle: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        },
        farro: {
            pasta: 1,
            riso: 1,
            orzo: 1,
            cereali: 1,
            friselle: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        },
        orzo: {
            pasta: 1,
            riso: 1,
            farro: 1,
            cereali: 1,
            friselle: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        },
        cereali: {
            pasta: 1,
            riso: 1,
            farro: 1,
            orzo: 1,
            friselle: 1,
            crostini: 1,
            pane: 1.3,
            patate: 4
        }
    };

    public static getSingleRate(carbo: carbohydrateType): { [key in carbohydrateType]?: number } {
        if (!carbo) {
            throw new Error('Carboidrato non specificato');
        }

        if (!this.conversionRates[carbo]) {
            throw new Error(`Nessun tasso di conversione trovato per ${carbo}`);
        }

        return this.conversionRates[carbo];
    }

    public static getAllRates() {
        return this.conversionRates;
    }

    public static getCarbohydrateTypes(): carbohydrateType[] {
        return Object.keys(this.conversionRates) as carbohydrateType[];
    }

    public static convert(amount: number, from: carbohydrateType, to: carbohydrateType): number {
        if (from === to) return amount;
        const rate = this.conversionRates[from]?.[to];
        if (rate === undefined) throw new Error(`Conversione non supportata da ${from} a ${to}`);
        return amount * rate;
    }

}

