import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addActionToSprite, deleteAction } from '../redux/spritesSlice.js';
import { Trash } from 'lucide-react';
import { SpriteImage } from './Sprite.js';
import ActionInput from './ActionInput.js';

const MidArea = () => {
  const dispatch = useDispatch();
  const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);
  const selectedSprite = useSelector((state) =>
    state.sprites.sprites.find(sprite => sprite.id === selectedSpriteId)
  );

  const handleDrop = (e) => {
    e.preventDefault();
    const actionType = e.dataTransfer.getData('actionType');
    const actionText = e.dataTransfer.getData('text');
    const payload = JSON.parse(e.dataTransfer.getData('payload'));

    if (selectedSpriteId) {
      dispatch(addActionToSprite({ spriteId: selectedSpriteId, actionType, actionText, payload }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 h-full overflow-auto bg-gray-100 p-6" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="bg-white rounded-lg shadow-md p-6">

        {selectedSprite ? (
          <>
            <div className='flex gap-4'>
              <h2 className="text-2xl flex font-bold text-gray-800 mb-4">Actions for Selected Sprite
              </h2>
              <div className='text-sm'><SpriteImage spriteName={selectedSprite.name} styles={{ width: "50px", height: "50px" }} /></div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Actions:</h3>
              <ul className="space-y-2">
                {selectedSprite.actions.map((action, index) => (
                  <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 flex justify-between align-middle rounded-full text-sm">
                    <ActionInput index={index} action={action} />
                    <button onClick={(e) => {
                      e.preventDefault();
                      dispatch(deleteAction({ index }))
                    }}
                    >
                      <Trash width={"18px"} color='red' />
                    </button>
                  </li>
                ))}
              </ul>
            </div></>
        ) : (
          <p className="text-gray-600 italic mb-6">No sprite selected</p>
        )}
      </div>
    </div>
  );
};

export default MidArea;
