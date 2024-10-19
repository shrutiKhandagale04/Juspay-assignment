import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSprite, toggleCollision } from "../redux/spritesSlice";
import { AddSprites } from "./AddSprites";
import SpriteCard from "./SpriteCard";


const SpriteControls = () => {
  const spritesState = useSelector((state) => state.sprites);
  const sprites = spritesState.sprites;
  const selectedSpritId = spritesState.selectedSpriteId
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col absolute bottom-0 w-96 border-t-2 pb-2 border-gray-200 bg-white " style={{ flex: 0.2 }}>
      
      <div className="flex justify-between items-center mb-2">
       
        <div className="flex gap-2">
          <div className="flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow-md">
            <label htmlFor="enableCollision" className="text-gray-700 font-medium mr-4">
              Swap Actions On Collision
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="enableCollision"
                className="opacity-0 w-0 h-0"
                checked={spritesState.showCollisionAnimation}
                onChange={(e) => {
                  dispatch(toggleCollision({ showCollisionAnimation: e.target.checked }));
                }}
              />
              <label
                htmlFor="enableCollision"
                className={`absolute top-0 left-0 right-0 bottom-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${spritesState.showCollisionAnimation ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${spritesState.showCollisionAnimation ? 'transform translate-x-6' : ''
                    }`}
                ></span>
              </label>
            </div>
          </div>
          <AddSprites />
        </div>
      </div>
      <div className="flex gap-4 items-start overflow-x-auto">
        <div className="flex gap-2">
          {sprites.map((sprite, index) => (
            <SpriteCard
              key={index}
              spriteName={sprite.name}
              selected={sprite.id === selectedSpritId}
              onClick={(e) => {
                e.preventDefault()
                dispatch(selectSprite(sprite.id))
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpriteControls