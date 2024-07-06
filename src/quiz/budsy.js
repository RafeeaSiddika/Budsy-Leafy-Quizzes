import { BUDSY_ASSET_KEYS } from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js";
import { HealthBar } from "./ui/health-bar.js";

export class Budsy {
    /** @type {Phaser.Scene} */
    #scene
    /** @type {Phaser.GameObjects.Sprite} */
    #budsy 
    /** @type {HealthBar} */
    #healthBar
    /** @type {number} */
    #currentHP; 
    /** Amount of damage taken per wrong question */
    #damage = 20; 
    
    constructor(scene, currentHP = 100) {
        this.#scene = scene; 

        let frameNames = this.#scene.anims.generateFrameNames(BUDSY_ASSET_KEYS.IDLE, 
        {
            frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
        })

        // Render out the budsy animation
        this.#scene.anims.create({
            key:"idle", 
            frames:frameNames, 
            frameRate: 16, 
            repeat: -1
        })

        this.#budsy =  this.#scene.add.sprite(840,230, BUDSY_ASSET_KEYS.IDLE, 1)
                                        .setScale(0.75);
        
        // Create budsy's health bar 
        this.#currentHP = currentHP; 
        this.#healthBar = new HealthBar(this.#scene); 
        this.#healthBar.setPercent(this.#currentHP); 
    }

    /**
     * Gets Budsy's current HP
     * @returns {number} Budsy's Current Health 
     */
    getCurrentHP() {
        return this.#currentHP; 
    }

    setCurrentHP(currentHP) {
        this.#currentHP = currentHP; 
    }

    /**
     * Plays budsy's idle animation 
     */
    playIdleAnimation() {
        this.#budsy.play("idle"); 
    }

    /**
     * 
     * @param {() => void} [callback]
     */
    takeDamage(callback) {
        this.#currentHP -= this.#damage; 
        // Check if the current HP is less than 0 
        if (this.#currentHP < 0) {
            this.#currentHP = 0; 
        }
        // reset the health bar 
        this.#healthBar.setPercent(this.#currentHP); 
        if (callback) {
            callback();
        }
    }

}