import { Stack } from "@/helper";
import React, { useEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.cjs";
import { io } from "socket.io-client";

const GLOBAL_CONTEXT = React.createContext();

const generator = rough.generator();
let s = new Stack();
let r = new Stack();
export const Provider = ({ children }) => {
  const canvasRef = React.useRef(null);
  const [currentTool, setCurrentTool] = React.useState("pen");
  const [mouseDown, setMouseDown] = React.useState(true);
  const [roughCanvas, setRoughCanvas] = React.useState(null);
  const socket = useRef(null);
  const drawRectangle = (e) => {
    let data = {
      tool: "rect",
      clientX: e.clientX,
      clientY: e.clientY,
    };
    if (roughCanvas) {
      let rect = generator.rectangle(e.clientX, e.clientY, 100, 100, {
        stroke: "#fff",
      });
      roughCanvas.draw(rect);
    }
  };
  const eraser = (e) => {
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").strokeStyle = "rgba(23 23 23 / 1)";
    canvasRef.current.getContext("2d").moveTo(e.clientX, e.clientY);
    canvasRef.current.getContext("2d").lineWidth = 10;
    setMouseDown(false);
    let data = {
      clientX: e.clientX,
      clientY: e.clientY,
      tool: currentTool,
    };
  };

  const drawPath = (e) => {
    if (canvasRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      ctx.putImageData(e, 0, 0);
    }
  };

  const drawPen = (e) => {
    canvasRef.current.getContext("2d").beginPath();
    canvasRef.current.getContext("2d").moveTo(e.clientX, e.clientY);
    setMouseDown(false);
  };

  const resetCanvas = () => {
    let ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const onMouseMove = (e, tool) => {
    if ((tool == "pen" || tool == "erase") && !mouseDown) {
      if (canvasRef.current) {
        let ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = 3;

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
      }
    }
  };
  const undo = () => {
    if (canvasRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      if (s.idx > 0) {
        r.push(s.top());
      }
      s.pop();
      if (s.idx > 0) ctx.putImageData(s.top(), 0, 0);
      else resetCanvas();
    }
  };

  const redo = () => {
    if (canvasRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      if (r.idx > 0) {
        ctx.putImageData(r.top(), 0, 0);
        r.pop();
      } else resetCanvas();
    }
  };
  const onMouseUp = (e) => {
    console.log(s);
    setMouseDown(true);
    let tool = canvasRef.current.getContext("2d");
    if (!mouseDown) {
      let ctx = canvasRef.current.getContext("2d");
      let imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      socket.current.emit("end-path", imageData);
      s.push(imageData);
      console.log("fired end path");
    }
    if (currentTool == "erase") {
      tool.lineWidth = 1;
      tool.strokeStyle = "white";
    }
  };

  const onMouseDown = (e, currentTool) => {
    switch (currentTool) {
      case "rect":
        drawRectangle({ clientX: e.clientX, clientY: e.clientY });

        break;
      case "pen":
        drawPen({ clientX: e.clientX, clientY: e.clientY });

        break;
      case "erase":
        eraser({ clientX: e.clientX, clientY: e.clientY });
        break;
      default:
        console.log("INVALID CHOICE");
    }
  };

  useEffect(() => {
    if (!socket || !socket.current)
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL);
  }, [socket]);

  return (
    <GLOBAL_CONTEXT.Provider
      value={{
        canvasRef,
        setRoughCanvas,

        currentTool,
        setCurrentTool,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        socket,
        drawPen,
        setMouseDown,
        drawRectangle,
        resetCanvas,
        drawPath,
        undo,
        redo,
      }}
    >
      {children}
    </GLOBAL_CONTEXT.Provider>
  );
};

export default GLOBAL_CONTEXT;
