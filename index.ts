import { deepClone, deepFreeze } from './src/index';

class Person {
  public h = {
    a: 20
  };

  constructor(public name: string, public age: number, private _happy = true) {}

  public get happy(): boolean {
    return this._happy;
  }

  public unhappy(): void {
    this._happy = false;
  }
}

const p1 = {
  name: 'Daniel Castillo',
  age: 20
};

const p2 = deepClone(p1);

p1.name = 'Katherin Bolaño';

console.log(p1);
console.log(p2);

const p3 = new Person('Adrian Castillo', 15);

const p4 = deepClone(p3);

p3.name = 'Fabian Castillo';
p4?.unhappy();

console.log(p3);
console.log(p3.happy);
console.log(p4);
console.log(p4?.happy);

const p5 = new Person('Milton Castillo', 30);
const cloneP5 = deepClone(p5);

const p6 = deepFreeze(cloneP5);

p5.unhappy();

console.log(p5);
console.log(p6);
