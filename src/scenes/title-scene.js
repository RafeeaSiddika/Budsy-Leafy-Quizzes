import { BUDSY_ASSET_KEYS, GAME_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, UI_ASSET_KEYS } from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js"
import { QuizMenu } from "../quiz/ui/menu/quiz-menu.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class TitleScene extends Phaser.Scene {
    #showCreditOverlay() {
        throw new Error("Method not implemented.");
    }
    /** @type {Phaser.GameObjects.Image} */
    #enterBtn; 
    #creditInfoBtn;
    /** @type {Phaser.GameObjects.Image} */
    #creditExitBtn;
    /** @type {Phaser.GameObjects.Image} */
    #overlay;
    /** @type {Phaser.GameObjects.Image} */
    #credits;

    constructor() {
        super({
            key: SCENE_KEYS.TITLE_SCENE, 
        }); 

       
    }

    #enterBtnOnHover = () => {
        this.#enterBtn.setTexture(UI_ASSET_KEYS.UI_PLAY_BTN_HOVER)
        this.input.setDefaultCursor('pointer');
    }
    
    #enterBtnOnClick = () => {
        // Transition to the quiz scene
        this.#goToQuizScene();
    }
    
    #enterBtnOutOfHover = () => {
        this.#enterBtn.setTexture(UI_ASSET_KEYS.UI_PLAY_BTN)
        this.input.setDefaultCursor('default');
    }

    #creditInfoBtnOnHover = () => {
        console.log("hovered")
        this.#creditInfoBtn.setTexture(UI_ASSET_KEYS.UI_CREDIT_INFO_BTN_HOVER)
        this.input.setDefaultCursor('pointer');
    }
    
    #creditInfoBtnOnClick = () => {
        // Transition to the quiz scene
        this.#showCreditsOverlay(); 
    }
    
    #creditInfoBtnOutOfHover = () => {
        this.#creditInfoBtn.setTexture(UI_ASSET_KEYS.UI_CREDIT_INFO_BTN)
        this.input.setDefaultCursor('default');
    }

    #creditExitBtnOnHover = () => {
        console.log("hovered")
        this.#creditExitBtn.setTexture(UI_ASSET_KEYS.UI_EXIT_CREDIT_BTN_HOVER)
        this.input.setDefaultCursor('pointer');
    }
    
    #creditExitBtnOnClick = () => {
        // Transition to the quiz scene
        this.#hideCreditsOverlay(); 
    }
    
    #creditExitBtnOutOfHover = () => {
        this.#creditExitBtn.setTexture(UI_ASSET_KEYS.UI_EXIT_CREDIT_BTN)
        this.input.setDefaultCursor('default');
    }

    #goToQuizScene() {
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start(SCENE_KEYS.QUIZ_SCENE);
            console.log("Start new level")
        });
    }

    create() {
        console.log(`[${TitleScene.name}:create] invoked`)
        QuizMenu.retrieveQuestions()
        .then(() => {
            console.log(`[${TitleScene.name}:retrieveQuestions] invoked`)
             // Add the background
            this.add.image(0,0, GAME_BACKGROUND_ASSET_KEYS.TITLE).setOrigin(0)
            // Add the budsy animation 
            
            // Add the buttons for the enter and the credits button 
            this.#enterBtn = this.add.image(this.sys.game.canvas.width/2 - 100,this.sys.game.canvas.height/2 + 160,UI_ASSET_KEYS.UI_PLAY_BTN);
            // Make the enter button interactive and add hover, out of hover and click
            this.#enterBtn.setInteractive(); 
            this.#enterBtn.on(Phaser.Input.Events.POINTER_OVER, () => {
                this.#enterBtnOnHover();
            });
            this.#enterBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.#enterBtnOnClick();
            });
            this.#enterBtn.on(Phaser.Input.Events.POINTER_OUT, () => {
                this.#enterBtnOutOfHover();
            });

            this.#creditInfoBtn = this.add.image(
                this.sys.game.canvas.width - 20,this.sys.game.canvas.height - 20,
                UI_ASSET_KEYS.UI_CREDIT_INFO_BTN)
                .setOrigin(1,1);
            
            this.#creditInfoBtn.setInteractive(); 
            this.#creditInfoBtn.on(Phaser.Input.Events.POINTER_OVER, () => {
                this.#creditInfoBtnOnHover();
            });
            this.#creditInfoBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.#creditInfoBtnOnClick();
            });
            this.#creditInfoBtn.on(Phaser.Input.Events.POINTER_OUT, () => {
                this.#creditInfoBtnOutOfHover();
            });
            
            // Create the budsy  seated animation 
            let frameNames = this.anims.generateFrameNames(BUDSY_ASSET_KEYS.SEATED, 
                {
                    frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
                })
        
            // Render out the budsy animation
            this.anims.create({
                key:"seated", 
                frames:frameNames, 
                frameRate: 16, 
                repeat: -1
            })

            const budsy =  this.add.sprite(this.sys.game.canvas.width/2,this.sys.game.canvas.height/2 - 160, BUDSY_ASSET_KEYS.SEATED, 1)
                                            .setScale(0.5);
            budsy.play("seated")

            this.#createCreditsOverlay(); 
            this.#hideCreditsOverlay(); 

        })
        .catch((error) => {
            console.error('Failed to load questions:', error);
        });
    }

    #createCreditsOverlay() {
        //TODO - create the credits overlay, crediting myself and the youtuber's tutorials
        this.#overlay = this.add.image(0,0,
            UI_ASSET_KEYS.OVERLAY)
            .setOrigin(0);
        this.#credits = this.add.image(this.sys.game.canvas.width/2,this.sys.game.canvas.height/2,
            UI_ASSET_KEYS.CREDIT_OVERLAY)
        this.#creditExitBtn = this.add.image(this.sys.game.canvas.width/2 + this.#credits.displayWidth/2 - 50 ,
            this.sys.game.canvas.height/2 - this.#credits.displayHeight/2 + 50,
            UI_ASSET_KEYS.UI_EXIT_CREDIT_BTN)

        // Make the credit exit button interactive 
        this.#creditExitBtn.setInteractive(); 
        this.#creditExitBtn.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.#creditExitBtnOnHover();
        });
        this.#creditExitBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.#creditExitBtnOnClick();
        });
        this.#creditExitBtn.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.#creditExitBtnOutOfHover();
        });
    }

    #hideCreditsOverlay() {
        this.#creditInfoBtn.setInteractive();
        this.#creditInfoBtnOutOfHover(); 
        this.#enterBtn.setInteractive();
        this.#overlay.setAlpha(0)
        this.#credits.setAlpha(0)
        this.#creditExitBtn.setAlpha(0)
    }

    #showCreditsOverlay() {
        this.#creditInfoBtn.disableInteractive();
        this.#enterBtn.disableInteractive();
        this.#overlay.setAlpha(1)
        this.#credits.setAlpha(1)
        this.#creditExitBtn.setAlpha(1)
        this.input.setDefaultCursor('default');

    }
}