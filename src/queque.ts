import { Optional } from './optional';

class QuequeElement<T> {
  private nextElement?: QuequeElement<T>;

  constructor(public readonly value: T) {}

  public set next(element: Undefined<QuequeElement<T>>) {
    this.nextElement = element;
  }

  public get next(): Undefined<QuequeElement<T>> {
    return this.nextElement;
  }
}

export class Queque<T> {
  private head?: QuequeElement<T>;

  private tail?: QuequeElement<T>;

  private lengthValue = 0;

  public get length(): number {
    return this.lengthValue;
  }

  public enqueue(value: T): void {
    const newElement = new QuequeElement(value);

    if (!this.head) {
      this.head = newElement;
    } else if (this.tail) {
      this.tail.next = newElement;
    }

    this.tail = newElement;

    this.lengthValue++;
  }

  public dequeue(): Optional<T> {
    if (this.head) {
      const value = this.head.value;

      this.head = this.head.next;

      this.lengthValue--;

      return Optional.of(value);
    }

    return Optional.empty();
  }
}
