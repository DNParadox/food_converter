export interface SuggestionConfig {
    originalAmount: number;
    from: string;
    to: string;
    convertedAmount: number;
    keepPercentage?: number;
    convertPercentage?: number;
    template?: string;
}

export class Suggestion {
    
    private static readonly DEFAULT_KEEP_PERCENTAGE = 0.7;
    private static readonly DEFAULT_CONVERT_PERCENTAGE = 0.3;
    private static readonly DEFAULT_TEMPLATE = 
        'Hai {originalAmount}g di {from}? Potresti fare {remainingAmount}g di {from} e {suggestedAmount}g di {to}.';

    public static generate(config: SuggestionConfig): string {
        // Validazione base
        this.validateConfig(config);

        // Percentuali con valori default
        const keepPercentage = config.keepPercentage ?? this.DEFAULT_KEEP_PERCENTAGE;
        const convertPercentage = config.convertPercentage ?? this.DEFAULT_CONVERT_PERCENTAGE;
        const template = config.template ?? this.DEFAULT_TEMPLATE;

        // Calcoli
        const remainingAmount = Math.round(config.originalAmount * keepPercentage);
        const suggestedAmount = Math.round(config.convertedAmount * convertPercentage);

        // Genera messaggio sostituendo i placeholder
        return template
            .replace(/{originalAmount}/g, config.originalAmount.toString())
            .replace(/{from}/g, config.from)
            .replace(/{to}/g, config.to)
            .replace(/{remainingAmount}/g, remainingAmount.toString())
            .replace(/{suggestedAmount}/g, suggestedAmount.toString());
    }

    private static validateConfig(config: SuggestionConfig): void {
        if (!config.originalAmount || config.originalAmount <= 0) {
            throw new Error('originalAmount deve essere maggiore di 0');
        }
        if (!config.convertedAmount || config.convertedAmount <= 0) {
            throw new Error('convertedAmount deve essere maggiore di 0');
        }
        if (!config.from || !config.to) {
            throw new Error('from e to sono obbligatori');
        }
        
        const keepPercentage = config.keepPercentage ?? this.DEFAULT_KEEP_PERCENTAGE;
        const convertPercentage = config.convertPercentage ?? this.DEFAULT_CONVERT_PERCENTAGE;
        
        if (Math.abs(keepPercentage + convertPercentage - 1) > 0.001) {
            throw new Error('keepPercentage + convertPercentage deve essere uguale a 1');
        }
    }

    // Metodi di utilità per configurazioni predefinite
    public static generateDefault(originalAmount: number, from: string, to: string, convertedAmount: number): string {
        return this.generate({
            originalAmount,
            from,
            to,
            convertedAmount
        });
    }

    public static generateWithCustomSplit(originalAmount: number, from: string, to: string, 
                                        convertedAmount: number, keepPercentage: number): string {
        return this.generate({
            originalAmount,
            from,
            to,
            convertedAmount,
            keepPercentage,
            convertPercentage: 1 - keepPercentage
        });
    }
}