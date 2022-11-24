import { Optional } from './optional';

class QuequeElement<T> {
  private _next?: QuequeElement<T>;

  constructor(private _value: T) {}

  public get value(): T {
    return this._value;
  }

  public set next(element: Undefined<QuequeElement<T>>) {
    this._next = element;
  }

  public get next(): Undefined<QuequeElement<T>> {
    return this._next;
  }
}

export class Queque<T> {
  private _head?: QuequeElement<T>;

  private _tail?: QuequeElement<T>;

  private _length = 0;

  public get length(): number {
    return this._length;
  }

  public enqueue(value: T): void {
    const newElement = new QuequeElement(value);

    if (!this._head) {
      this._head = newElement;
    } else if (this._tail) {
      this._tail.next = newElement;
    }

    this._tail = newElement;

    this._length++;
  }

  public dequeue(): Optional<T> {
    if (this._head) {
      const value = this._head.value;

      this._head = this._head.next;

      this._length--;

      return Optional.of(value);
    }

    return Optional.empty();
  }
}
