import { useState } from "react";

export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}





export class Stack {
  idx =-1;
  items=[];
  constructor() {
    this.items = [];
  }

  push(item) {
    this.idx+=1;
    this.items.push(item);
  }

  pop() {
    if (this.idx != -1) {
      this.items.splice(-1, 1);
      this.idx--;
      return;
    }
    console.log("OUT OF BOUNDS")
  }

  top() {
    if (top != -1) {
      let ab = this.items[this.idx];
      return ab;
    }
    return;
  }

  empty(){
    while(this.idx>0){
      this.pop();
    }
  }
}
