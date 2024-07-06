import { BUDSY_ASSET_KEYS, GAME_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, UI_ASSET_KEYS } from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js"
import { QuizMenu } from "../quiz/ui/menu/quiz-menu.js";
import { SCENE_KEYS } from "./scene-keys.js";
import * as WebFontLoader from '../lib/webfontloader.js'
import { BAKSOSAPIO_LIGHT, BAKSOSAPIO_REGULAR, LUCKIEST_GUY } from "../assets/font-keys.js";

export class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE, 
        }); 
    }
    
    preload() {
        console.log(`[${PreLoadScene.name}:preload] invoked`)
        // Pathway constants
        const spriteAssetPath = 'assets/images/sprite';
        const bgAssetPath = 'assets/images/background';
        const uiAssetPath = 'assets/images/ui';

        // Background
        this.load.image(
            GAME_BACKGROUND_ASSET_KEYS.FIELD, 
            `${bgAssetPath}/field.png`
        )
        // Title Background
        this.load.image(
            GAME_BACKGROUND_ASSET_KEYS.TITLE, 
            `${bgAssetPath}/title-bg.png`
        )

        // Budsy 
        this.load.spritesheet(
            BUDSY_ASSET_KEYS.IDLE, 
            `${spriteAssetPath}/idle.png`,
            {
                frameWidth:384, 
                frameHeight:384
            }
        )

        // Budsy seated 
        this.load.spritesheet(
            BUDSY_ASSET_KEYS.SEATED, 
            `${spriteAssetPath}/seated.png`,
            {
                frameWidth:512, 
                frameHeight:512
            }
        )

        // UI
        this.load.image(
            UI_ASSET_KEYS.ANSWER, 
            `${uiAssetPath}/UI-Answer.png`
        )
        this.load.image(
            UI_ASSET_KEYS.QUESTION, 
            `${uiAssetPath}/UI-Question.png`
        )

        this.load.image(
            UI_ASSET_KEYS.SELECTED, 
            `${uiAssetPath}/UI-Selected.png`
        )
        this.load.image(
            UI_ASSET_KEYS.SELECTED_CORRECT, 
            `${uiAssetPath}/UI-Selected-Correct.png`
        )
        this.load.image(
            UI_ASSET_KEYS.SELECTED_INCORRECT, 
            `${uiAssetPath}/UI-Selected-Incorrect.png`
        )
        this.load.image(
            UI_ASSET_KEYS.QUESTION_COUNT_BG, 
            `${uiAssetPath}/UI-question-count-bg.png`
        )
        this.load.image(
            UI_ASSET_KEYS.QUESTION_COUNT_BG, 
            `${uiAssetPath}/UI-question-count-bg.png`
        )
        this.load.image(
            UI_ASSET_KEYS.LEAF_COUNT, 
            `${uiAssetPath}/UI-leaf-count.png`
        )
        this.load.image(
            UI_ASSET_KEYS.HOME_BTN, 
            `${uiAssetPath}/UI-home-btn.png`
        )
        this.load.image(
            UI_ASSET_KEYS.HOME_BTN_HOVER, 
            `${uiAssetPath}/UI-home-btn-hover.png`
        )

        // UI Finished state components 
        this.load.image(
            UI_ASSET_KEYS.FINISHED_HOME_BTN, 
            `${uiAssetPath}/UI-btn-finished-home.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_HOME_NEXT, 
            `${uiAssetPath}/UI-btn-finished-next.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_HOME_BTN_HOVER, 
            `${uiAssetPath}/UI-btn-finished-home-hover.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_HOME_NEXT_HOVER, 
            `${uiAssetPath}/UI-btn-finished-next-hover.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_1_STAR, 
            `${uiAssetPath}/UI-finished-1-star.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_2_STAR, 
            `${uiAssetPath}/UI-finished-2-stars.png`
        )
        this.load.image(
            UI_ASSET_KEYS.FINISHED_3_STAR, 
            `${uiAssetPath}/UI-finished-3-stars.png`
        )

        // UI game over state components 
        this.load.image(
            UI_ASSET_KEYS.GAME_OVER_0_STAR, 
            `${uiAssetPath}/UI-gameover-0-stars.png`
        )
        this.load.image(
            UI_ASSET_KEYS.GAME_OVER_1_STAR, 
            `${uiAssetPath}/UI-gameover-1-stars.png`
        )
        this.load.image(
            UI_ASSET_KEYS.GAME_OVER_2_STAR, 
            `${uiAssetPath}/UI-gameover-2-stars.png`
        )
        this.load.image(
            UI_ASSET_KEYS.GAME_OVER_3_STAR, 
            `${uiAssetPath}/UI-gameover-3-stars.png`
        )
        this.load.image(
            UI_ASSET_KEYS.OVERLAY, 
            `${uiAssetPath}/UI-overlay.png`
        )
        

        // UI Title Components
        this.load.image(
            UI_ASSET_KEYS.UI_CREDIT_INFO_BTN, 
            `${uiAssetPath}/UI-credit-info-btn.png`
        )
        
        this.load.image(
            UI_ASSET_KEYS.UI_CREDIT_INFO_BTN_HOVER, 
            `${uiAssetPath}/UI-credit-info-btn-hover.png`
        )
        this.load.image(
            UI_ASSET_KEYS.UI_PLAY_BTN, 
            `${uiAssetPath}/UI-play-btn.png`
        )
        this.load.image(
            UI_ASSET_KEYS.UI_PLAY_BTN_HOVER, 
            `${uiAssetPath}/UI-play-btn-hover.png`
        )
        this.load.image(
            UI_ASSET_KEYS.UI_EXIT_CREDIT_BTN, 
            `${uiAssetPath}/UI-exit-credit-btn.png`
        )
        this.load.image(
            UI_ASSET_KEYS.UI_EXIT_CREDIT_BTN_HOVER, 
            `${uiAssetPath}/UI-exit-credit-btn-hover.png`
        )
        this.load.image(
            UI_ASSET_KEYS.CREDIT_OVERLAY, 
            `${uiAssetPath}/credits-overlay.png`
        )
        
        
        
        // Health Bar
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_0, 
            `${uiAssetPath}/health-0.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_1, 
            `${uiAssetPath}/health-1.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_2, 
            `${uiAssetPath}/health-2.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_3, 
            `${uiAssetPath}/health-3.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_4, 
            `${uiAssetPath}/health-4.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BAR_5, 
            `${uiAssetPath}/health-5.png`
        )
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.BG, 
            `${uiAssetPath}/health-bg.png`
        )

        // Load the custom fonts
        WebFontLoader.default.load({
            custom: {
                families: [LUCKIEST_GUY, BAKSOSAPIO_LIGHT, BAKSOSAPIO_REGULAR ]
            }, 
            active: () => {
                console.log('Font Ready')
            }
        })
        
    }

    startTitleScene() {
        // Proceed to the next scene
        console.log(`[${PreLoadScene.name}:startTitleScene] invoked`)
    }

    create() {
        console.log(`[${PreLoadScene.name}:create] invoked`)
        this.scene.start(SCENE_KEYS.TITLE_SCENE);
    }

}
