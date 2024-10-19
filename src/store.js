import { configureStore } from '@reduxjs/toolkit';
import spritesReducer from './redux/spritesSlice.js';

export const store = configureStore({
    reducer: {
        sprites: spritesReducer,
    },
});
