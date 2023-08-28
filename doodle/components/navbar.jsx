import React, { useContext } from "react";
import { BsArrowUpRight,BsEraser } from "react-icons/bs";
import {BiRectangle,BiRedo,BiUndo,BiSolidPencil,BiFontColor} from "react-icons/bi"
import GLOBAL_CONTEXT from "@/context";
import Image from "next/image";
const Navbar = () => {
    const {setCurrentTool,currentTool,tool}=useContext(GLOBAL_CONTEXT)
    const [showColors,setShowColors]=React.useState(false);
    const updateColor=(color)=>{
        tool.strokeStyle=color;
    }
    const MENU=[
        {
            "name":"pen",
            "icon":<BiSolidPencil/>,
        },
        {
            "name":"rect",
            "icon":<BiRectangle />,
        },
        {
            "name":"erase",
            "icon":<BsEraser />
        },
        {

            "name":"redo",
            "icon":<BiRedo />
        },
        {
            "name":"undo",
            "icon":<BiUndo />
        },

    ]
  return (
    <>
      <main className="py-2 w-screen flex absolute top-0 z-50">
       
        <nav className=" flex gap-3 items-center py-2 h-full mx-auto">
        <span onClick={()=>setShowColors(!showColors)}  className={` relative bg-zinc-800 border-2 cursor-pointer max-w-min block p-3 rounded-md shadow}`}>
            <BiFontColor/>
           {showColors && <span className="block absolute -bottom-[60px] -left-10 bg-neutral-800 border-white/20 border-2 rounded px-4  flex h-12 items-center justify-center gap-2">
                <span onClick={()=>updateColor("red")} className="w-8 h-8 bg-red-600 rounded hover:borer-white hover:border-2"></span>
                <span onClick={()=>updateColor("#008000")} className="w-8 h-8 bg-green-600 rounded hover:borer-white hover:border-2"></span>
                <span onClick={()=>updateColor("blue")} className="w-8 h-8 bg-blue-600 rounded hover:borer-white hover:border-2"></span>
                <span onClick={()=>updateColor("#87CEEB")} className="w-8 h-8 bg-sky-600 rounded hover:borer-white hover:border-2"></span>
                <span onClick={()=>updateColor("yellow")} className="w-8 h-8 bg-yellow-600 rounded hover:borer-white hover:border-2"></span>
                <span onClick={()=>updateColor("white")} className="w-8 h-8 bg-white rounded hover:borer-white hover:border-2"></span>
            </span>}
          </span>
            {MENU.map((_item,_idx)=><span key={_item.name} onClick={()=>setCurrentTool(_item.name)} className={`bg-zinc-800 border-2 ${currentTool==_item.name?"border-red-500":"border-gray-700/50"} cursor-pointer max-w-min block p-3 rounded-md shadow}`}>
            {_item.icon}
          </span>)}
         
          
          {/* <span onClick={()=>setCurrentTool("rect")} className={`bg-zinc-800 border-2 ${currentTool=="rect"?"border-red-500":"border-gray-700/50"} cursor-pointer max-w-min block p-3 rounded-md shadow}`}>
            <BiRectangle />
          </span>
          <span className="bg-zinc-800 border-2 border-gray-700/50 cursor-pointer max-w-min block p-3 rounded-md shadow">
            <BsEraser />
          </span>
          <span className="bg-zinc-800 border-2 border-gray-700/50 cursor-pointer max-w-min block p-3 rounded-md shadow">
            <BiRedo />
          </span>
          <span className="bg-zinc-800 border-2 border-gray-700/50 cursor-pointer max-w-min block p-3 rounded-md shadow">
            <BiUndo />
          </span> */}
        </nav>
      </main>
    </>
  );
};

export default Navbar;
