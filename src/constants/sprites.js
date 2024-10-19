import { v4 as uuid } from 'uuid'
const catId = uuid()
const ballId = uuid()
const birdId = uuid()
const duckId = uuid()



export const SPRITE_WIDTH = 85;
export const SPRITE_HEIGHT = 85;
export default [
    {
        id: catId,
        name: "cat",
        position: { x: 0, y: 0 },
        rotation: 0,
        actions: [],
    },
 
    {
        id: ballId,
        name: "ball",
        position: { x: 140, y: 0 },
        rotation: 0,
        actions: [],
    },
    {
        id: birdId,
        name: "bird",
        position: { x: 140, y: 0 },
        rotation: 0,
        actions: [],
    },
    {
        id: duckId,
        name: "duck",
        position: { x: 140, y: 0 },
        rotation: 0,
        actions: [],

    }
]