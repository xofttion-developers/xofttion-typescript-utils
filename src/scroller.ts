export class ScrollerElement {
  constructor(private element: HTMLElement, private _scrollError = 0) {}

  public get scrollWidth(): number {
    return this.element.scrollWidth;
  }

  public get scrollHeight(): number {
    return this.element.scrollHeight;
  }

  public get scrollLeft(): number {
    return this.element.scrollLeft;
  }

  public get scrollTop(): number {
    return this.element.scrollTop;
  }

  public get clientWidth(): number {
    return this.element.clientWidth;
  }

  public get clientHeight(): number {
    return this.element.clientHeight;
  }

  public get verticalStart(): boolean {
    return this.scrollTop === 0;
  }

  public get verticalEnd(): boolean {
    return (
      this.scrollTop + this.clientHeight >= this.scrollHeight - this._scrollError
    );
  }

  public get verticalPercentage(): number {
    const height = this.scrollHeight - this.clientHeight;

    return (this.scrollTop / height) * 100;
  }

  public get horizontalStart(): boolean {
    return this.scrollLeft === 0;
  }

  public get horizontalEnd(): boolean {
    return (
      this.scrollLeft + this.clientWidth >= this.scrollWidth - this._scrollError
    );
  }

  public get horizontalPercentage(): number {
    const width = this.scrollWidth - this.clientWidth;

    return (this.scrollLeft / width) * 100;
  }
}
