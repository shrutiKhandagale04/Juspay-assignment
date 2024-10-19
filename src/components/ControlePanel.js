import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveSprite, rotateSprite, swapAnimations } from '../redux/spritesSlice';

const ControlPanel = () => {
    const dispatch = useDispatch();
    const sprites = useSelector(state => state.sprites.sprites);

    const handleMove = (id) => {
        dispatch(moveSprite({ id, steps: 10 }));
    };

    const handleRotate = (id) => {
        dispatch(rotateSprite({ id, degrees: 15 }));
    };

    const handleSwapAnimations = () => {
        if (sprites.length >= 2) {
            dispatch(swapAnimations({ sprite1Id: sprites[0].id, sprite2Id: sprites[1].id }));
        }
    };

    return (
        <div className="control-panel flex space-x-4">
            {sprites.map(sprite => (
                <div key={sprite.id}>
                    <button onClick={() => handleMove(sprite.id)} className="bg-green-500 px-2 py-1">
                        Move Sprite {sprite.id}
                    </button>
                    <button onClick={() => handleRotate(sprite.id)} className="bg-blue-500 px-2 py-1">
                        Rotate Sprite {sprite.id}
                    </button>
                </div>
            ))}
            <button onClick={handleSwapAnimations} className="bg-red-500 px-2 py-1">
                Swap Animations
            </button>
        </div>
    );
};

export default ControlPanel;
