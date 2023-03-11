import { Double } from './src/index';

const d3 = Double.create(745834720.0001);
console.log(d3);
console.log(d3.value);

const d4 = Double.create(423.0002);
console.log(d4);
console.log(d4.value);

const d1 = d3.plus(d4);
console.log(d1);
console.log(d1.value);
console.log(d1.equals(0.0003));
