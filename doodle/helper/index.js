export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

export class Stack {
  idx = -1;

  constructor() {
    this.items = [];
  }

  push(item) {
    this.idx++;
    this.items.push(item);
  }

  pop() {
    if (idx != -1) {
      this.items.splice(-1, 1);
      this.idx--;
    }
  }

  top() {
    if (top != -1) {
      let ab = this.items[this.idx];
      this.idx--;
      return ab;
    }
  }
}
