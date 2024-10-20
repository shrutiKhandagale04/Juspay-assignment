import { createSlice } from '@reduxjs/toolkit';
import allSprites, { SPRITE_HEIGHT, SPRITE_WIDTH } from '../constants/sprites';

const initialState = {
    sprites: [
        allSprites[0]
    ],
    selectedSpriteId: allSprites[0].id,
    showCollisionAnimation: false,
    collisionHandled: false,
};

// Helper function to find a sprite by its ID
const findSpriteById = (state, spriteId) => state.sprites.find(sprite => sprite.id === spriteId);

// Function to check if two sprites are touching or overlapping
const checkCollision = (sprite1, sprite2) => {
    const { x: x1, y: y1 } = sprite1.position;
    const { x: x2, y: y2 } = sprite2.position;

    // Check for horizontal and vertical overlap
    const horizontalOverlap = !(x1 > x2 + SPRITE_WIDTH || x1 + SPRITE_WIDTH < x2);
    const verticalOverlap = !(y1 > y2 + SPRITE_HEIGHT || y1 + SPRITE_HEIGHT < y2);

    // Check for touching horizontally or vertically
    const touchHorizontally = (x1 + SPRITE_WIDTH === x2 || x2 + SPRITE_WIDTH === x1);
    const touchVertically = (y1 + SPRITE_HEIGHT === y2 || y2 + SPRITE_HEIGHT === y1);

    // Return true if sprites overlap or touch
    return (horizontalOverlap && verticalOverlap) || touchHorizontally || touchVertically;
};

const spritesSlice = createSlice({
    name: 'sprites',
    initialState,
    reducers: {
        addSprite: (state, action) => {
            state.sprites.push({
                id: action.payload.id,
                name: action.payload.name,
                position: { x: 0, y: 0 },
                rotation: 0,
                actions: [],
            });
            state.selectedSpriteId = action.payload.id;
        },
        selectSprite: (state, action) => {
            state.selectedSpriteId = action.payload;
        },
        addActionToSprite: (state, action) => {
            const { spriteId, actionType, actionText, payload } = action.payload;
            const sprite = findSpriteById(state, spriteId);
            if (sprite) {
                sprite.actions.push({ type: actionType, text: actionText, payload });
            }
        },
        move: (state, action) => {
            const { steps, spriteId } = action.payload;
            const sprite = findSpriteById(state, spriteId);
            if (sprite) {
                sprite.position.x += Math.cos((sprite.rotation * Math.PI) / 180) * steps;
                sprite.position.y -= Math.sin((sprite.rotation * Math.PI) / 180) * steps;
            }
        },
        goTo: (state, action) => {
            const { x, y, spriteId } = action.payload;
            const sprite = findSpriteById(state, spriteId);
            if (sprite) {
                sprite.position.x = x;
                sprite.position.y = y;
            }
        },
        rotate: (state, action) => {
            const { degree, spriteId } = action.payload;
            const sprite = findSpriteById(state, spriteId);
            if (sprite) {
                sprite.rotation += degree;
            }
        },
        deleteAction: (state, action) => {
            const { index } = action.payload;
            const sprite = findSpriteById(state, state.selectedSpriteId);
            if (sprite) {
                sprite.actions.splice(index, 1);
            }
        },
        toggleCollision: (state, action) => {
            const { showCollisionAnimation } = action.payload;
            if (showCollisionAnimation && state.sprites.length > 2) {
                state.sprites = state.sprites.slice(0, 2); // Avoid mutating original array
            }
            state.showCollisionAnimation = showCollisionAnimation;
        },
        checkCollisionAndSwap: (state, action) => {
            const { spriteId1, spriteId2 } = action.payload;
            const sprite1 = findSpriteById(state, spriteId1);
            const sprite2 = findSpriteById(state, spriteId2);

            if (!sprite1 || !sprite2) return; // Ensure both sprites exist

            if (checkCollision(sprite1, sprite2) && state.showCollisionAnimation) {
                // Swap actions if the sprites collide and the collision animation is enabled
                [sprite1.actions, sprite2.actions] = [sprite2.actions, sprite1.actions];
                state.showCollisionAnimation = false;
                state.collisionHandled = true;
            }
        },
        resetCollisionHandled: (state) => {
            state.collisionHandled = false;
        },
        updateActionValue: (state, action) => {
            const sprite = findSpriteById(state, state.selectedSpriteId);
            const { index, field, value } = action.payload;
            if (sprite) {
                sprite.actions[index]['payload'][field] = value;
            }
        }
    },
});

export const {
    addSprite, selectSprite, updateActionValue, toggleCollision,
    resetCollisionHandled, deleteAction, checkCollisionAndSwap,
    goTo, move, rotate, addActionToSprite
} = spritesSlice.actions;

export default spritesSlice.reducer;
