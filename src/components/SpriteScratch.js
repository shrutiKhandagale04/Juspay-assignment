import React, { useCallback, useEffect, useRef, useState } from "react";
import Sprite from "./Sprite";
import { useDispatch, useSelector } from "react-redux";
import { checkCollisionAndSwap, goTo, move, resetCollisionHandled, rotate } from "../redux/spritesSlice";
import { PlayCircle } from "lucide-react";
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
        const sprite = sprites.find(sprite => sprite.id === spriteId);
        if (!sprite || sprite.actions.length === 0) return;

        let actionIndex = 0;
        clearTimeout(timeoutRefs.current[sprite.id]);

        const executeNextAction = () => {
            if (actionIndex >= sprite.actions.length) return;

            const action = sprite.actions[actionIndex];
            executeAction({ spriteId: sprite.id, type: action.type, payload: action.payload });

            if (sprites.length > 1 && spritesState.showCollisionAnimation && !spritesState.collisionHandled) {
                sprites.forEach((sprite2) => {
                    if (sprite2.name !== sprite.name) {
                        dispatch(checkCollisionAndSwap({ spriteId1: sprite.id, spriteId2: sprite2.id }));
                    }
                });
            }

            actionIndex++;
            timeoutRefs.current[sprite.id] = setTimeout(executeNextAction, 400);
        };

        executeNextAction();
    };
    const play = () => {
        sprites.forEach((sprite) => {
            playForSprite(sprite.id);
        });
    };
    const clearTimeouts = () => {
        Object.keys(timeoutRefs.current).forEach(spriteId => {
            clearTimeout(timeoutRefs.current[spriteId]);
        });
    }
    useEffect(() => {
        if (spritesState.collisionHandled) {
            clearTimeouts()
            play();
            dispatch(resetCollisionHandled());
        }
    }, [spritesState.collisionHandled])
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
            clearTimeouts()
        };
    }, []);

    const handleDragStart = useCallback((spriteId) => {
        setDraggingSprite(spriteId);
    }, []);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        if (!containerRef.current || !draggingSprite) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        const newX = e.clientX - containerRect.left - centerX;
        const newY = centerY - (e.clientY - containerRect.top);

        dispatch(goTo({
            spriteId: draggingSprite,
            x: newX, y: newY
        }));

        setDraggingSprite(null);
    }, [dispatch, draggingSprite, containerRef]);
    return (
        <div className="stage-area overflow-hidden relative bg-white border-2 border-gray-200" style={{ flex: 0.8 }} ref={containerRef} onDragOver={handleDragOver}
            onDrop={handleDrop}>
            {
                sprites.map((sprite) => <Sprite key={sprite.id} sprite={sprite} containerSize={containerSize}
                    onDragStart={handleDragStart}
                />)
            }
            <div className="absolute bottom-4 right-3">
                <button
                    onClick={play}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    <PlayCircle className="mr-2" size={20} />
                    Play
                </button>
            </div>
        </div>
    );
}
