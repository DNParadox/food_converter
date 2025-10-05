import { Suggestion } from './classes/Suggestion';
import { CarbohydratesConverter } from './classes/CarbohydratesConverter';
import { validateInput } from './utils/validateInput';

const amount: number = parseFloat(process.argv[2]);
const from: string = process.argv[3];
const to: string = process.argv[4];

const { fromFood, toFood } = validateInput(amount, from, to);

const result = CarbohydratesConverter.convert(amount, fromFood, toFood);
// const test = CarbohydratesConverter.getAllRates();
// console.log(test);
const singleRate = CarbohydratesConverter.getSingleRate('piselli');
console.log(singleRate);    
// console.log(`${amount}g di ${fromFood} equivalgono a ${result.toFixed(2)}g di ${toFood}`);
// const suggestion = new Suggestion(fromFood, toFood, amount).getMessage();
// console.log(suggestion);