import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import CatSprite from '../sprites/CatSprite';
import BallSprite from '../sprites/BallSprite';
import BirdSprite from '../sprites/BirdSprite';
import DuckSprite from '../sprites/DuckSprite';
import { selectSprite } from '../redux/spritesSlice';
import { SPRITE_HEIGHT, SPRITE_WIDTH } from '../constants/sprites';

// This component chooses which sprite to render based on the sprite name.
export const SpriteImage = ({ spriteName, styles, handleClick }) => {
    switch (spriteName) {
        case "cat":
            return <CatSprite styles={styles} onClick={handleClick} />;
        case "ball":
            return <BallSprite styles={styles} onClick={handleClick} />;
        case "bird":
            return <BirdSprite styles={styles} onClick={handleClick} />;
        case "duck": 
            return <DuckSprite styles={styles} onClick={handleClick} />;
        default:
            return <></>;
    }
};

const Sprite = ({ sprite, containerSize, shakeSprite, onDragStart }) => {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        dispatch(selectSprite(sprite.id));
    };

    // Calculate the position of the sprite based on container size and sprite position.
    const { left, top } = useMemo(() => {
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        const spriteX = centerX + sprite.position.x - SPRITE_WIDTH / 2;
        const spriteY = centerY - sprite.position.y - SPRITE_HEIGHT / 2;

        return {
            left: spriteX,
            top: spriteY
        };
    }, [containerSize, sprite.position.x, sprite.position.y]);

    const handleDragStart = (e) => {
        onDragStart(sprite.id);
    };

    return (
        <div
            className={`absolute transition-transform duration-400 sprite ${shakeSprite ? 'shake' : ''}`} // Apply shake class conditionally
            style={{
                transform: `translate(${left}px, ${top}px) rotate(${sprite.rotation}deg)`,
                position: 'absolute',
                width: `${SPRITE_WIDTH}px`, // Use constant width
                height: `${SPRITE_HEIGHT}px`, // Use constant height
            }}
            draggable
            onDragStart={handleDragStart}
        >
            <SpriteImage
                spriteName={sprite.name}
                handleClick={handleClick}
                styles={{ width: SPRITE_WIDTH + "px", height: SPRITE_HEIGHT + "px" }}
            />
            {/* Explosion Effect */}
            {shakeSprite && (
                <div className="explosion-effect">
                    <img 
                        src="/boom-13280-ezgif.com-gif-maker.gif" 
                        alt="Explosion" 
                        style={{
                            position: 'absolute',
                            left: -25, // Center the explosion
                            top: -25,  // Center the explosion
                            width: 100, // Adjust based on explosion size
                            height: 100, // Adjust based on explosion size
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default Sprite;
