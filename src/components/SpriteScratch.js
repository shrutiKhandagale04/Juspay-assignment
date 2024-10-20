import React, { useCallback, useEffect, useRef, useState } from "react";
import Sprite from "./Sprite";
import { useDispatch, useSelector } from "react-redux";
import {
    checkCollisionAndSwap,
    goTo,
    move,
    resetCollisionHandled,
    resetShakeSprit,
    rotate,
    resetSprites, // Add resetSprites action from Redux
} from "../redux/spritesSlice";
import { PlayCircle, RefreshCcw } from "lucide-react"; // Import reset icon
import { GO_TO, MOVE_STEPS, REPEAT, TURN_DEGREES } from "../constants/sidebarBlocks";

export default function SpriteScratch() {
    const spritesState = useSelector((state) => state.sprites);
    const sprites = spritesState.sprites;
    const dispatch = useDispatch();
    const timeoutRefs = useRef({});
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [draggingSprite, setDraggingSprite] = useState(null);
    const containerRef = useRef(null);

    const executeAction = ({ spriteId, type, payload }) => {
        const actionMap = {
            [MOVE_STEPS]: () => dispatch(move({ spriteId, ...payload })),
            [TURN_DEGREES]: () => dispatch(rotate({ spriteId, ...payload })),
            [GO_TO]: () => dispatch(goTo({ spriteId, ...payload })),
            [REPEAT]: () => playForSprite(spriteId),
        };

        const action = actionMap[type];
        if (action) action();
    };

    const playForSprite = (spriteId) => {
        const sprite = sprites.find((sprite) => sprite.id === spriteId);
        if (!sprite || sprite.actions.length === 0) return;

        let actionIndex = 0;
        clearTimeout(timeoutRefs.current[sprite.id]);

        const executeNextAction = () => {
            if (actionIndex >= sprite.actions.length) return;

            const action = sprite.actions[actionIndex];
            executeAction({ spriteId: sprite.id, type: action.type, payload: action.payload });

            // Check for collisions with all sprites
            if (sprites.length > 1 && !spritesState.collisionHandled) {
                sprites.forEach((sprite2) => {
                    if (sprite2.id !== sprite.id) {
                        dispatch(
                            checkCollisionAndSwap({ spriteId1: sprite.id, spriteId2: sprite2.id })
                        );
                    }
                });
            }

            // If a collision is detected, stop further actions for this sprite
            if (spritesState.collisionHandled) return;

            actionIndex++;
            timeoutRefs.current[sprite.id] = setTimeout(executeNextAction, 400);
        };

        executeNextAction();
    };

    const play = () => {
        clearTimeouts(); // Clear existing timeouts before playing
        sprites.forEach((sprite) => {
            playForSprite(sprite.id);
        });
    };

    const clearTimeouts = () => {
        Object.keys(timeoutRefs.current).forEach((spriteId) => {
            clearTimeout(timeoutRefs.current[spriteId]);
        });
    };

    const reset = () => {
        clearTimeouts();
        dispatch(resetSprites()); // Dispatch the reset action to Redux
    };

    useEffect(() => {
        if (spritesState.collisionHandled) {
            clearTimeouts();
            play();
            dispatch(resetCollisionHandled());
        }
    }, [spritesState.collisionHandled]);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setContainerSize({ width, height });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(containerRef.current);
        return () => {
            resizeObserver.disconnect();
            clearTimeouts();
        };
    }, []);

    useEffect(() => {
        if (spritesState.shakeSprite) {
            console.log("Shake effect started");
            const timer = setTimeout(() => {
                console.log("Resetting shakeSprite");
                dispatch(resetShakeSprit());
            }, 1000);

            return () => {
                console.log("Clearing timer");
                clearTimeout(timer);
            };
        }
    }, [spritesState.shakeSprite, dispatch]);

    const handleDragStart = useCallback((spriteId) => {
        setDraggingSprite(spriteId);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            if (!containerRef.current || !draggingSprite) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            const newX = e.clientX - containerRect.left - centerX;
            const newY = centerY - (e.clientY - containerRect.top);

            dispatch(goTo({ spriteId: draggingSprite, x: newX, y: newY }));

            setDraggingSprite(null);
        },
        [dispatch, draggingSprite, containerRef]
    );

    console.log(`in sprite scratch ${spritesState.shakeSprite}`);

    return (
        <div
            className={`stage-area overflow-x-auto overflow-y-hidden relative bg-white border-2 border-gray-200
            ${spritesState.shakeSprite ? "animate-collision" : ""}`}
            style={{ flex: 0.8, width: '100%', height: '100%', position: 'relative' }}
            ref={containerRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div style={{ display: 'flex', width: '200%' }}>
                {sprites.map((sprite) => (
                    <Sprite
                        key={sprite.id}
                        sprite={sprite}
                        containerSize={containerSize}
                        shakeSprite={spritesState.shakeSprite}
                        onDragStart={handleDragStart}
                    />
                ))}
            </div>
            <div className="absolute bottom-4 right-3 flex gap-4">
                <button
                    onClick={play}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    <PlayCircle className="mr-2" size={20} />
                    Play
                </button>
                <button
                    onClick={reset}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    <RefreshCcw className="mr-2" size={20} />
                    Reset
                </button>
            </div>
        </div>
    );
}
