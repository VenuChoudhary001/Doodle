import { Stack } from "@/helper";
import React, { useEffect, useRef } from "react";
import rough from "roughjs/bundled/rough.cjs";
import { io } from "socket.io-client";

const GLOBAL_CONTEXT = React.createContext();

const generator = rough.generator();
let s = new Stack();
export const Provider = ({ children }) => {
  const canvasRef = React.useRef(null);
  const [currentTool, setCurrentTool] = React.useState("pen");
  const [mouseDown, setMouseDown] = React.useState(true);
  const [roughCanvas, setRoughCanvas] = React.useState(null);
  const [options,setOptions]=React.useState({
    stroke:"#fff",
    lineWidth:3
  })
  let prevColor="#fff";
  const prevCoordinate=useRef({x:undefined,y:undefined})
  const socket = useRef(null);

  const captureState=()=>{
    let ctx = canvasRef.current.getContext("2d");
    let imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    s.push(imageData);
  }



  const drawRectangle = (e) => {
    let data = {
      tool: "rect",
      clientX: e.clientX,
      clientY: e.clientY,
    };
    if (roughCanvas) {
      let rect = generator.rectangle(e.clientX, e.clientY, 100, 100, {...options});
      roughCanvas.draw(rect);
      captureState();
    }
  };
  const eraser = (e) => {
    prevColor=options.stroke;
    setOptions({
      ...options,
      stroke:"rgba(23 23 23 / 1)",
      lineWidth:3
    })
    setMouseDown(false);
  };

  const drawPath = (e) => {
    if (canvasRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      ctx.putImageData(e, 0, 0);
    }
  };

  const drawPen = (e) => {
    if(canvasRef && canvasRef.current){

      canvasRef.current.getContext("2d").beginPath();
      canvasRef.current.getContext("2d").moveTo(e.clientX, e.clientY);
      setMouseDown(false);
      prevCoordinate.current.x=e.clientX;
      prevCoordinate.current.y=e.clientY;
    }
  };

  const resetCanvas = () => {
    let ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    s.empty();
  };

  const onMouseMove = (e, tool) => {
    if ((tool == "pen" || tool == "erase") && !mouseDown) {
      if (roughCanvas) {
        let ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = 3;
        roughCanvas.line(prevCoordinate.current.x,prevCoordinate.current.y,e.clientX, e.clientY, {...options});
        prevCoordinate.current.x=e.clientX;
        prevCoordinate.current.y=e.clientY;
      }
    }
  };
  const undo = () => {
    if (canvasRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      s.pop();
      if (s.idx >=0) ctx.putImageData(s.top(), 0, 0);
      else resetCanvas();
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
      captureState();
      console.log("fired end path");
      prevCoordinate.current.x=undefined;
      prevCoordinate.current.y=undefined;
    }
    if (currentTool == "erase") {
       setOptions({...options,stroke:prevColor})
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
        setOptions,
        options
      }}
    >
      {children}
    </GLOBAL_CONTEXT.Provider>
  );
};

export default GLOBAL_CONTEXT;
