import React from "react";
import sidebarBlocks, { controlColor, motionColor } from "../constants/sidebarBlocks";
import SpriteControls from "./SpriteControls.js"

export default function Sidebar() {
  const handleDragStart = (e, actionType, payload, text) => {
    e.dataTransfer.setData('actionType', actionType);
    e.dataTransfer.setData('text', text);
    e.dataTransfer.setData('payload', JSON.stringify(payload));
  };
  return (
    <>
    <div className="w-96 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
    <div className="inline-block bg-purple-500  w-full text-center px-3 py-1 text-lg font-bold text-white mr-2 mb-2">
        Sidebar
      </div>
      {
        Object.keys(sidebarBlocks).map(key => {
          return (
            <div key={key}>
              <div className="mt-6 p-1 bg-gray-300 rounded-md">{key}</div>
              <div>
                {sidebarBlocks[key].map((block, index) => {
                  let bgColor = ""
                  let textColor = ""
                  switch (key) {
                    case "Motion":
                      bgColor = motionColor.bgColor
                      textColor = motionColor.textColor
                      break
                    case "Control":
                      bgColor = controlColor.bgColor
                      textColor = controlColor.textColor
                      break
                    default:
                      break
                  }
                  
                  
                   return <div
                   key={index}
                   draggable
                   onDragStart={(e) => handleDragStart(e, block.type, block.defaultPayload, block.text)} 
                   className="mt-4"
                   style={{ maxWidth: "200px" }}
                 >
                   <div className="relative">
                     <div className={` rounded-md p-1 z-0 flex items-center relative ${bgColor} ${textColor}`}>
                       <p className="text-white  text-sm  mr-2">{block.text}</p>
                       <div className="flex-1">
                         <input
                           id="movex"
                           name="movex"
                           type="text"
                           placeholder="0"
                           value={0}
                           className="p-1 rounded-md w-full text-xs border-none"
                         />
                       </div>
                     </div>
                     <div className={`absolute bottom-5 left-0 h-5 w-10 ${bgColor} transform rounded-lg`}></div>
                   </div>
                 </div>
                })}
              </div>
            </div>
          );
        })
      }
      <div className="mt-6 mb-2 w-60 p-1 absolute bottom-52 bg-gray-300 rounded-md">Sprites</div>
         <SpriteControls></SpriteControls>
    </div>
  
    </>
  );
}
