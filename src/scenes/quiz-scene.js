import { BUDSY_ASSET_KEYS, GAME_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, UI_ASSET_KEYS} from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js"
import { Budsy } from "../quiz/budsy.js";
import { Background } from "../quiz/ui/background.js";
import { HealthBar } from "../quiz/ui/health-bar.js";
import { QuizMenu } from "../quiz/ui/menu/quiz-menu.js";
import { StateMachine } from "../utils/state-machine.js";
import { SCENE_KEYS } from "./scene-keys.js";
import { QUIZ_STATES } from "../assets/quizStates.js";
import { LEVEL_DIFFICULTY } from "../assets/levels.js";
import { exhaustiveGuard } from "../utils/guard.js";
import { LUCKIEST_GUY } from "../assets/font-keys.js";

export class QuizScene extends Phaser.Scene {
    /** @type {QuizMenu} */
    #quizMenu;
    /** @type {StateMachine} */
    #quizStateMachine;
    /** Current Level */
    #currLevel = 1; 
    /** Current leaf count */
    #leafCount = 0; 
    /** Current HP of Budsy */
    #currentHP = 100; 
    /** @type {boolean} */
    #gameOver = false; 
    /** @type {Phaser.GameObjects.Image} */
    #backBtn; 
    /** @type {Phaser.GameObjects.Image} */
    #overlay; 
    /** @type {Phaser.GameObjects.Container} */
    #overlayContainer

    constructor() {
        super({
            key: SCENE_KEYS.QUIZ_SCENE, 
        }); 
        console.log( SCENE_KEYS.QUIZ_SCENE )
    }
    

    create() {
        console.log(`[${QuizScene.name}:create] invoked`)
        // Create main background
        const background = new Background(this); 
        background.showField(); 

        // Create budsy
        const budsy = new Budsy(this, this.#currentHP); 
        budsy.playIdleAnimation(); 
        
        // Create the quiz menu 
        console.log(`Current level: ${this.#currLevel}`)
        this.#quizMenu = new QuizMenu(this, budsy, this.#currLevel, this.#leafCount);
        this.#quizMenu.showQuizMenu(); 

        this.#createQuizStateMachine(); 
    }

    reset() {
        this.#leafCount = 0;
        this.#currLevel = 1; 
        // Reset budsy's current hp 
        this.#currentHP = 100; 
        this.#gameOver = false; 
    }

    #transitionToNextScene(sceneKey) {
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // Check if we are going home 
            // if(sceneKey === SCENE_KEYS.TITLE_SCENE)
            //     this.scene.restart({crthis.#currentHP}); 
            this.scene.start(sceneKey);
        });
    }

    #createQuizStateMachine() {
         // Create the state machine 
        this.#quizStateMachine = new StateMachine("quiz", this); 
        this.#quizStateMachine.addState({
            name:QUIZ_STATES.INTRO, 
            onEnter: () => {
                // Wait for any scene setup and transitions to complete
                this.#quizStateMachine.setState(QUIZ_STATES.BRING_OUT_BUDSY); 
            }
        })

        this.#quizStateMachine.addState({
            name:QUIZ_STATES.BRING_OUT_BUDSY,
            onEnter: () => {
                // Wait for any budsy to enter the scene
                this.#quizStateMachine.setState(QUIZ_STATES.USER_INPUT); 
            }
        })

        this.#quizStateMachine.addState({
            name:QUIZ_STATES.USER_INPUT,
            onEnter: () => {
                // Set the next question for the user 
                this.#quizMenu.setNextQuestion(); 
                this.#quizStateMachine.setState(QUIZ_STATES.QUIZ); 
                // this.#createEndGameOverlay(); 
            }
        })
        this.#quizStateMachine.addState({
            name:QUIZ_STATES.QUIZ,
            onEnter: () => {
                // Add the state machine to the quiz state machine
                this.#quizMenu.setStateMachine(this.#quizStateMachine); 
            }
        })
        this.#quizStateMachine.addState({
            name:QUIZ_STATES.FINISHED,
            onEnter: () => {
                console.log("Quiz finished");
                // Check if the quiz finished because budsy died or if it's because 
                // there are no more questions left 
                this.#currLevel = this.#quizMenu.getLevel(); 
                this.#leafCount = this.#quizMenu.getLeafCount(); 
                this.#currentHP = this.#quizMenu.getBudsy().getCurrentHP(); 
                console.log(`Current Level after finished quiz: ${this.#currentHP}`)
                
                // If budsy died, set the game over to true
                if(this.#currentHP === 0) {
                    this.#gameOver = true; 
                    // Show the overlay 
                }

                // Retrieve next level of questions if we have not completed all three levels  
                this.#createEndGameOverlay(this.#currLevel - 1);
            }
        })
        this.#quizStateMachine.addState({
            name:QUIZ_STATES.RESET,
            onEnter: () => {
                // reset the scene 
                this.reset(); 
            }
        })

        // Start state machine
        this.#quizStateMachine.setState('INTRO')
    }

    #backBtnOnHover = () => {
        this.input.setDefaultCursor('pointer');
        // If the game is over or it is on level 4 then we have the home button set
        if(this.#gameOver || this.#currLevel === 4) {
            this.#backBtn.setTexture(UI_ASSET_KEYS.FINISHED_HOME_BTN_HOVER)
        }
        else {
            this.#backBtn.setTexture(UI_ASSET_KEYS.FINISHED_HOME_NEXT_HOVER)
        }
            
    } 

    #backBtnOnClick = () => {
        if(this.#gameOver || this.#currLevel === 4) {
            // Reset before transitioning 
            this.#hideEndGameOverlay(); 
            this.reset(); 
            this.#transitionToNextScene(SCENE_KEYS.TITLE_SCENE); 
        }
        else {
            QuizMenu.retrieveQuestions()
            .then(() => {
                // Continue with other preload tasks or start next scene
                console.log('Questions loaded, proceeding to create set of questions.');
                this.#transitionToNextScene(SCENE_KEYS.QUIZ_SCENE); 
            })
            .catch((error) => {
                console.error('Failed to load questions:', error);
            });
        }
    } 

    #backBtnOutOfHover = () => {
        this.input.setDefaultCursor('default');
        if(this.#gameOver || this.#currLevel === 4) {
            this.#backBtn.setTexture(UI_ASSET_KEYS.FINISHED_HOME_BTN)
        }
        else {
            this.#backBtn.setTexture(UI_ASSET_KEYS.FINISHED_HOME_NEXT)
        }
    } 

    #createEndGameOverlay(level = 1) {
        this.#overlay = this.add
        .image(0, 0, UI_ASSET_KEYS.OVERLAY)
        .setOrigin(0)
        .setDepth(3)

        this.#quizMenu.disableAnswersInteractivity(); 

        // Create the container for the endgame overlay 
        this.#overlayContainer = this.add.container(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2 - 40,[])
            .setDepth(3)
        // Create the overlay UI 
        const overlayUI = this.add
                .image(0,0, UI_ASSET_KEYS.GAME_OVER_0_STAR)
                .setScale(0.35)

                
        // Add the button 
        this.#backBtn = this.add
            .image(0,overlayUI.displayHeight/2, 
                this.#gameOver ? UI_ASSET_KEYS.FINISHED_HOME_BTN : UI_ASSET_KEYS.FINISHED_HOME_NEXT)
            .setScale(0.35)

        // Make the button interactive
        this.#backBtn.setInteractive();
        this.#backBtn.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.#backBtnOnHover();
        });
        
        this.#backBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.#backBtnOnClick();
        });
        this.#backBtn.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.#backBtnOutOfHover();
        });
        
        // Add the text for the UI 
        const overlayUIText = this.add.text(0, 0, `${this.#gameOver ? 'GAME OVER' : 'LEVEL COMPLETE'}`, {
            fontSize:`${this.#gameOver ? '30px' : '26px'}`,
            fontFamily: LUCKIEST_GUY
        })

        overlayUIText.setX(-overlayUIText.width/2)
        overlayUIText.setY(-overlayUI.displayHeight/2 + 10.5) 
        
        // Add the current score to the overlay 
        const scoreText = this.add.text(overlayUI.displayWidth/2 - 60, -6, `${this.#leafCount}`, {
            fontSize:"20px",
            fontFamily: LUCKIEST_GUY
        }).setOrigin(1,0)  
        
        // Add the next level to the overlay 
        const nextLevelText =this.add.text(overlayUI.displayWidth/2 - 60, 55, `${LEVEL_DIFFICULTY[this.#currLevel]}`, {
            fontSize:"20px",
            fontStyle: "bold"
        }).setOrigin(1,0) 

        this.#overlayContainer.add(overlayUI)
        this.#overlayContainer.add(this.#backBtn)
        this.#overlayContainer.add(overlayUIText)
        this.#overlayContainer.add(scoreText)
        this.#overlayContainer.add(nextLevelText)

        // Add the end overlay based on the level 
        switch (level) {
                case 0: 
                    overlayUI.setTexture(UI_ASSET_KEYS.GAME_OVER_0_STAR)
                    nextLevelText.setAlpha(0)   
                    break;
                case 1:
                    // Check if it the game is over or not 
                    overlayUI.setTexture(!this.#gameOver 
                        ? UI_ASSET_KEYS.FINISHED_1_STAR
                        :UI_ASSET_KEYS.GAME_OVER_1_STAR)
                    nextLevelText.setAlpha(!this.#gameOver ? 1 : 0 )
                    break;
                case 2:
                    // Check if it the game is over or not 
                    overlayUI.setTexture(!this.#gameOver 
                        ? UI_ASSET_KEYS.FINISHED_2_STAR
                        :UI_ASSET_KEYS.GAME_OVER_2_STAR)
                    nextLevelText.setAlpha(!this.#gameOver ? 1 : 0 )
                    break;
                case 3:
                    // Check if it the game is over or not 
                    overlayUI.setTexture(!this.#gameOver
                        ? UI_ASSET_KEYS.FINISHED_3_STAR
                        :UI_ASSET_KEYS.GAME_OVER_3_STAR)
                    // Change the button to the home button 
                    this.#backBtn.setTexture(UI_ASSET_KEYS.FINISHED_HOME_BTN)
                    nextLevelText.setAlpha(0)
                    break;
                default:
                    console.log("Invalid level set")
                    break;
        }
    }

    #hideEndGameOverlay() {
        // Destroy the overlay container and the overlay 
        this.#overlay.destroy();
        this.#overlayContainer.destroy();

    }

    update() {
        this.#quizStateMachine.update(); 
    }
}
