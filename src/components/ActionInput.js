import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActionValue } from '../redux/spritesSlice';
import { GO_TO, MOVE_STEPS, TURN_DEGREES } from '../constants/sidebarBlocks.js';

const ActionInput = ({ action, index }) => {
    const dispatch = useDispatch();
    const parts = action.text.split('__');
    const selectedSpriteId = useSelector((state) => state.sprites.selectedSpriteId);
    const selectedSprite = useSelector((state) =>
        state.sprites.sprites.find(sprite => sprite.id === selectedSpriteId)
    );
    const spriteAction = selectedSprite.actions[index];
    const getInputCallbacks = () => {
        switch (action.type) {
            case MOVE_STEPS:
                return [(value) => dispatch(updateActionValue({ index, field: 'steps', value }))];
            case TURN_DEGREES:
                return [(value) => dispatch(updateActionValue({ index, field: 'degree', value }))];
            case GO_TO:
                return [
                    (value) => dispatch(updateActionValue({ index, field: 'x', value })),
                    (value) => dispatch(updateActionValue({ index, field: 'y', value }))
                ];
            default:
                return [];
        }
    };

    const inputCallbacks = getInputCallbacks();

    return (
        <div>{parts.map((part, partIndex) => (
            <React.Fragment key={partIndex}>
                {part}
                {partIndex < parts.length - 1 && inputCallbacks[partIndex] && (
                    <input
                        type="number"
                        className="w-16 mx-1 px-2 py-1 text-black rounded border border-blue-300"
                        value={
                            action.type === MOVE_STEPS ? spriteAction.payload.steps :
                                action.type === TURN_DEGREES ? spriteAction.payload.degree :
                                    action.type === GO_TO ? (partIndex === 0 ? spriteAction.payload.x : spriteAction.payload.y) :
                                        ''
                        }
                        onChange={(e) => inputCallbacks[partIndex](e.target.valueAsNumber)}
                    />
                )}
            </React.Fragment>
        ))}</div>
    );
};

export default ActionInput;