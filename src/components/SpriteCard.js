import { SpriteImage } from "./Sprite";
import React from "react";
const SpriteCard = ({ spriteName, onClick, selected }) => {

    console.log(spriteName)
    return (
        <div
            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all
      ${selected ? "border-purple-500" : "border-gray-300"}`}
            onClick={onClick}
        >
            <SpriteImage spriteName={spriteName} styles={{ width: "60px", height: "60px" }} />
            <p className="text-sm font-semibold mt-2">{spriteName}</p>
        </div>
    );
};

export default SpriteCard;
