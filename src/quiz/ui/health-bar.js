import { HEALTH_BAR_ASSET_KEYS } from "../../assets/asset-keys.js";
import { BAKSOSAPIO_LIGHT } from "../../assets/font-keys.js";
import Phaser from "../../lib/phaser.js";
import { exhaustiveGuard } from "../../utils/guard.js";

export class HealthBar{
    /** @type {Phaser.Scene} */
    #scene 
    /** @type {Phaser.GameObjects.Image}*/
    #healthBar
    /** @type {Phaser.GameObjects.Text} */
    #budsyPercent; 

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.#scene = scene; 
        this.#createHealthBar(); 
    }

    #createHealthBar() {
        // Render out budsy's health bar 
        const healthBg = this.#scene.add
        .image(0,0, HEALTH_BAR_ASSET_KEYS.BG)
        .setOrigin(0)
        .setScale(0.65)

        this.#healthBar = this.#scene.add
        .image(0,0, HEALTH_BAR_ASSET_KEYS.BAR_5)
        .setOrigin(0)
        .setScale(0.65)
        
        
        const healthBarFullLength = 122; 
        
        // Budsy's percentage
        this.#budsyPercent = this.#scene.add.text(
            healthBarFullLength + 10,-6, "100%",  
            {
                color: "#FFF", 
                fontSize: '24px',
                fontFamily: BAKSOSAPIO_LIGHT
            })
            .setOrigin(0,0)
        
        // Health bar container 
        this.#scene.add.container(758, 370, [
            healthBg,
            this.#healthBar, 
            this.#budsyPercent
        ]); 
    }

    /**
     * 
     * @param {number} percent number between 0 and 100 and a multiple of 20. 
     */

    setPercent(percent = 100) {
        // Change the percentage text to what has been passed in
        this.#budsyPercent.text = `${percent}%`
        switch(percent) {
            case 100: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_5);
                break;  
            case 80: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_4);
                break;     
            case 60: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_3);
                break;     
            case 40: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_2);
                break;     
            case 20: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_1);
                break;     
            case 0: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_0);
                break; 
            default: 
                this.#healthBar.setTexture(HEALTH_BAR_ASSET_KEYS.BAR_0);
                break; 
        }
    }
}