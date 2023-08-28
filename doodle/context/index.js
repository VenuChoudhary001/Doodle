
import { Stack } from "@/helper";
import React, { useRef } from "react";
import rough from "roughjs/bundled/rough.cjs";
import { io } from "socket.io-client";

const GLOBAL_CONTEXT = React.createContext();

const generator = rough.generator();
let s = new Stack();


export const Provider = ({ children }) => {
  const canvasRef = React.useRef(null);
  const [tool, setTool] = React.useState(null);
  const [currentTool, setCurrentTool] = React.useState("pen");
  const [mouseDown, setMouseDown] = React.useState(true);
  const [roughCanvas,setRoughCanvas]=React.useState(null);
  const socket=useRef(null);
  const drawRectangle = (e) => {
    let data={
      tool:"rect",
      clientX:e.clientX,
      clientY:e.clientY,
    }
    if (roughCanvas) {
      let rect = generator.rectangle(e.clientX, e.clientY, 100, 100, {
        stroke: "#fff",
      });
      roughCanvas.draw(rect);
    }
  };
  const eraser = (e) => {
    tool.beginPath();
    tool.strokeStyle = "rgba(23 23 23 / 1)";
    tool.moveTo(e.clientX, e.clientY);
    tool.lineWidth = 10;
    setMouseDown(false);
    let data={
      clientX:e.clientX,
      clientY:e.clientY,
      tool:currentTool
    }
  };

  const drawPen = (e) => {
      tool.beginPath();
      console.log(tool.strokeStyle);
      tool.moveTo(e.clientX, e.clientY);
      setMouseDown(false);
  };

  const onMouseMove = (e) => {

    if ((currentTool == "pen" || currentTool == "erase") && !mouseDown) {
      let data={
        clientX:e.clientX,
        clientY:e.clientY,
        tool:currentTool
      }
      tool.lineTo(e.clientX, e.clientY);
      tool.stroke();
    }
  };

  const onMouseUp = (e) => {
    
    setMouseDown(true);
    let tool=canvasRef.current.getContext("2d");
    if (currentTool == "erase") {
      tool.lineWidth = 1;
      tool.strokeStyle="white"
    }
    
  };

  const onMouseDown = (e,currentTool) => {
    switch (currentTool) {
      case "rect":
        s.push({ type: "rect" });
        drawRectangle({ clientX: e.clientX, clientY: e.clientY });
        break;
      case "pen":
        s.push({ type: "pen" });
        drawPen({ clientX: e.clientX, clientY: e.clientY });
        break;
      case "erase":
        eraser({ clientX: e.clientX, clientY: e.clientY });
        break;
      default:
        console.log("INVALID CHOICE");
    }
  };


  return (
    <GLOBAL_CONTEXT.Provider
      value={{
        canvasRef,
        setTool,
        setRoughCanvas,
        tool,
        currentTool,
        setCurrentTool,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        socket,
        drawPen
      }}
    >
      {children}
    </GLOBAL_CONTEXT.Provider>
  );
};

export default GLOBAL_CONTEXT;
