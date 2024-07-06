import {GAME_BACKGROUND_ASSET_KEYS} from '../../assets/asset-keys.js'
import Phaser from "../../lib/phaser.js";

export class Background {
    /** @type {Phaser.Scene} */
    #scene
    /** @type {Phaser.GameObjects.Image} */
    #backgroundGameObject
    constructor(scene) {
        this.#scene = scene; 
        this.#backgroundGameObject = this.#scene.add
            .image(0,0, GAME_BACKGROUND_ASSET_KEYS.FIELD)
            .setOrigin(0)
            .setAlpha(0);
    }

    showField() {
        this.#backgroundGameObject.setTexture(GAME_BACKGROUND_ASSET_KEYS.FIELD)
            .setAlpha(1); 
    }
}