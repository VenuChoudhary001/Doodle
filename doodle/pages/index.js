"use client";
import { Manrope } from "next/font/google";
import React, { useContext } from "react";
import Navbar from "@/components/navbar";
import GLOBAL_CONTEXT from "@/context";
import { io } from "socket.io-client";
import rough from "roughjs/bundled/rough.cjs";

const inter = Manrope({ subsets: ["latin"] });

export default function Home() {
  const { canvasRef, onMouseDown,drawPen, onMouseMove, onMouseUp, setTool,setRoughCanvas,currentTool,socket,tool } =
    useContext(GLOBAL_CONTEXT);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
      canvasRef.current.width=window.innerWidth;
      canvasRef.current.height=window.innerHeight;
      setTool(canvasRef.current.getContext("2d"));
      setRoughCanvas(rough.canvas(canvasRef.current));
      initializeSocket();
  }, []);
  
    const initializeSocket=async()=>{
        socket.current=io("http://localhost:9000");
        socket.current.on("begin-path",data=>{
          if(!tool) return;
          console.log("PATH BEGINGG")
        })

        socket.current.on("end-path",(data)=>{
          if(!tool) return;
          console.log("END-path detected")  
        });
    }

  return (
    <>
          <Navbar />

          <canvas
            ref={canvasRef}
            onMouseDown={(e)=>onMouseDown(e,currentTool)}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            width={1000}
            height={1000}
            className="bg-neutral-900"
          />
      
    </>
  );
}
