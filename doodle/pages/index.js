"use client";
import { Manrope } from "next/font/google";
import React, { useContext } from "react";
import Navbar from "@/components/navbar";
import GLOBAL_CONTEXT from "@/context";
import { io } from "socket.io-client";
import rough from "roughjs/bundled/rough.cjs";
import Image from "next/image";

const inter = Manrope({ subsets: ["latin"] });

export default function Home() {
  const {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    setRoughCanvas,
    currentTool,
    socket,
    drawPath
  } = useContext(GLOBAL_CONTEXT);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    setRoughCanvas(rough.canvas(canvasRef.current));
    if(!socket){
      initializaSocket();
    }
    
  }, []);
  
  
  const initializaSocket=async()=>{
    if(!socket || !socket.current) return ;
    socket.current.on("end-path",(data)=>{
      console.log("RECEIVED EVENT END PATH")
    })
  }
  

  return (
    <>
      <Navbar />
      <div className="absolute top-0 left-0 w-[200px] h-[80px] text-4xl z-[99] mx-5 flex items-center">
        <Image src={'/3.png'} priority width={278} height={65} className="" />
        &#10024;
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => onMouseDown(e, currentTool)}
        onMouseUp={onMouseUp}
        onMouseMove={(e) => onMouseMove(e, currentTool)}
        
        className="bg-neutral-900 w-full h-full absolute top-0 -z-1"
      />
    </>
  );
}
