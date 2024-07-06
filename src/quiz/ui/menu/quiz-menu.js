import { UI_ASSET_KEYS } from "../../../assets/asset-keys.js";
import Phaser from "../../../lib/phaser.js";
import { StateMachine } from "../../../utils/state-machine.js";
import { Budsy } from "../../budsy.js";
import {ANSWER_UI_TEXT_STYLE} from './quiz-menu-config.js'
import { QUIZ_STATES } from "../../../assets/quizStates.js";
import { LEVEL_DIFFICULTY } from "../../../assets/levels.js";
import { SCENE_KEYS } from "../../../scenes/scene-keys.js";
import { BAKSOSAPIO_LIGHT, LUCKIEST_GUY } from "../../../assets/font-keys.js";


export class QuizMenu {
    /** @type {Phaser.Scene} */
    #scene; 
    /** @type {Phaser.GameObjects.Container} */
    #answersContainer; 
    /** @type {Phaser.GameObjects.Container} */
    #questionContainer; 
    /** @type {Phaser.GameObjects.Text} */
    #questionCountText; 
    /** @type {Phaser.GameObjects.Text} */
    #leafCountText; 
    /** @type {number} */
    #questionCount = 0; 
    /** @type {number} */
    #leafCount = 0; 
    /** @type {string} */
    #correctAnswer; 
    /** @type {Budsy} */
    #budsy; 
    /** @type {Object[]} */
    static questions = []; // Static property to store fetched questions
    /** @type {number} */
    static currLevel = 1; 
    /** @type {StateMachine} */
    #quizStateMachine; 
    /** @type {Phaser.GameObjects.Image} */
    #homeBtn; 
    
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene, budsy, currLevel, leafCount) {
        this.#scene = scene; 
        this.#budsy = budsy; 
        QuizMenu.currLevel = currLevel;
        this.#leafCount = leafCount; 
    }

    setStateMachine(stateMachine) {
        this.#quizStateMachine = stateMachine; 
    }

    showQuizMenu() {
        this.#addMenuHeader(); 
    }

    getBudsy() {
        return this.#budsy; 
    }

    getQuestionCount() {
        return this.#questionCount; 
    }

    getLevel() {
        return QuizMenu.currLevel; 
    }

    getLeafCount() {
        return this.#leafCount; 
    }

    increaseLevel() {
        QuizMenu.currLevel++; 
    }

    /**
     * Method generates new questions from the TRIVIA API 
     */
    static async retrieveQuestions() {
        console.log(`METHOD: Retrieve Questions - Curr Level = ${this.currLevel} - Current Level Difficulty = ${LEVEL_DIFFICULTY[this.currLevel]}`);
        const apiUrl = `https://opentdb.com/api.php?amount=10&category=9&difficulty=${LEVEL_DIFFICULTY[this.currLevel]}&type=multiple&encode=url3986`;
        const maxRetries = 5; // Maximum number of retries
        let attempt = 0; // Current attempt number
        let delay = 1000; // Initial delay in milliseconds
    
        while (attempt < maxRetries) {
            try {
                const response = await fetch(apiUrl);
                if (response.status === 429) {
                    // Handle rate limiting
                    attempt++;
                    console.warn(`Rate limited. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                    continue;
                }
    
                const data = await response.json();
                if (data.results) {
                    // Decode URL encoding
                    this.questions = data.results.map(item => {
                        item.question = decodeURIComponent(item.question);
                        item.correct_answer = decodeURIComponent(item.correct_answer);
                        item.incorrect_answers = item.incorrect_answers.map(answer => decodeURIComponent(answer));
                        return item;
                    });
                    console.log('Questions retrieved:', this.questions);
                    return; // Exit the method after successful retrieval
                } else {
                    console.error('Failed to fetch questions:', data);
                    return;
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                attempt++;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    
        console.error('Max retries reached. Could not fetch questions.');
    }

    moveToNextLevel = () =>  {
        QuizMenu.retrieveQuestions()
        .then(() => {
            // Continue with other preload tasks or start next scene
            console.log('Questions loaded, proceeding to create set of questions.');
            this.#questionCount = 0; 
            this.setNextQuestion(); 
        })
        .catch((error) => {
            console.error('Failed to load questions:', error);
            
        });
    }

    /**
     * Sets the questions and corresponding answer
     */
    setNextQuestion() {
        // Check if we have reached the last question 
        if(this.#questionCount >= 10) {
            console.log("All Questions have been answered"); 
            this.increaseLevel();   
            this.#quizStateMachine.setState(QUIZ_STATES.FINISHED); 
            return; 
        }

        // Destroy the current answer containers then create new answers 
        if (this.#answersContainer) {
            this.#answersContainer.destroy(); 
        }
        
        // Combine correct and incorrect answers into one array
        const answers = [
            ...QuizMenu.questions[this.#questionCount].incorrect_answers,
            QuizMenu.questions[this.#questionCount].correct_answer
        ];

        // Store the correct answer
        this.#correctAnswer = QuizMenu.questions[this.#questionCount].correct_answer;
    
        // Shuffle the array
        this.#shuffleArray(answers);
    
        // Create a mapping for the answers container
        const answersMapping = answers.reduce((acc, answer, index) => {
            acc[index + 1] = answer; // Mapping answers 1 to 4
            return acc;
        }, {});
    
        // Create new answers container with shuffled answers
        this.#createAnswersContainer(answersMapping);
    
        // Destroy the current question container then create new question container
        if (this.#questionContainer) {
            this.#questionContainer.destroy(); 
        }
        this.#addQuestionContainer(QuizMenu.questions[this.#questionCount].question);
    
        // Increase the question count 
        this.#questionCount++; 

        this.#updateQuestionCountText(); 
    }
    
    /**
     * Utility function to shuffle an array
     * @param {Array} array - The array to shuffle
     */
    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    #createAnswersContainer(answers) {
        // Create the answer options 
        let answerOpt1 = answers[1];
        let answerOpt2 = answers[2];
        let answerOpt3 = answers[3];
        let answerOpt4 = answers[4];

        // Add the answer option backgrounds 
        const answer1 = this.#scene.add
        .image(0, 0, UI_ASSET_KEYS.ANSWER)
        .setOrigin(0)
        .setScale(0.75, 1);
        
        const answer2 = this.#scene.add
        .image(0, 0, UI_ASSET_KEYS.ANSWER)
        .setOrigin(1,0)
        .setScale(0.75, 1);

        const answer3 = this.#scene.add
        .image(0,0, UI_ASSET_KEYS.ANSWER)
        .setOrigin(0)
        .setScale(0.75, 1);
        
        const answer4 = this.#scene.add
        .image(0, 0, UI_ASSET_KEYS.ANSWER)
        .setOrigin(1,0)
        .setScale(0.75, 1);

        // Create the text object with word wrapping
        let textObject1 = this.#scene.add.text(0, 0, answerOpt1, ANSWER_UI_TEXT_STYLE).setOrigin(0);
        let textObject2 = this.#scene.add.text(0, 0, answerOpt2, ANSWER_UI_TEXT_STYLE).setOrigin(0);
        let textObject3 = this.#scene.add.text(0, 0, answerOpt3, ANSWER_UI_TEXT_STYLE).setOrigin(0);
        let textObject4 = this.#scene.add.text(0, 0, answerOpt4, ANSWER_UI_TEXT_STYLE).setOrigin(0);

        /**
         * Answer Text Coordinates
         */
        // Get the answer1 coordinates 
        let answer1Cords = this.#calcAnswerCords(1,answer1.displayHeight, answer1.displayWidth, textObject1.height, textObject1.width); 
        // Get the answer 2 coordinates
        let answer2Cords = this.#calcAnswerCords(2,answer2.displayHeight, answer2.displayWidth, textObject2.height, textObject2.width); 
        // Get answer 3 coordinates 
        let answer3Cords = this.#calcAnswerCords(3,answer3.displayHeight, answer3.displayWidth, textObject3.height, textObject3.width); 
        // Get the answer 4 coordinates
        let answer4Cords = this.#calcAnswerCords(2,answer4.displayHeight, answer4.displayWidth, textObject4.height, textObject4.width); 
        
        // Create the answers container
        this.#answersContainer = this.#scene.add.container(40,120, []); 
        
        this.#createAnswerOptions(
            {answer1, answer2, answer3, answer4}, 
            {answer1Cords, answer2Cords, answer3Cords, answer4Cords},
            {textObject1, textObject2, textObject3, textObject4},
            {
                1:{x:0,y:0},
                2:{x:620,y:0},
                3:{x:0,y:answer1.displayHeight + 30},
                4:{x:620,y:answer1.displayHeight + 30},
            }, 
            this.#answersContainer
        )
    }
    
    disableAnswersInteractivity() {
        this.#answersContainer.each(container => {
            let answerImage = container.list[2];
            // Turn off the interactivity of each answer option 
            answerImage.disableInteractive(); 
        });
    }

    enableAnswersInteractivity() {
        this.#answersContainer.each(container => {
            let answerImage = container.list[2];
            // Turn off the interactivity of each answer option 
            answerImage.setInteractive(); 
        });
    }

    // Create an on hover method to check if it works 
    #onHover = (outline) => {
        this.#answersContainer.each(container => {
            let outlineImage = container.list[0]; // Assuming outline is the first child
            outlineImage.setAlpha(0);
        });

        outline.setAlpha(1)
        this.#scene.input.setDefaultCursor('pointer');
    }

    #outOfHover = (outline) => {
        outline.setAlpha(0)
        this.#scene.input.setDefaultCursor('default');
    }

    /**
     * 
     * @param {string} selectedAnswer 
     * @param {Phaser.GameObjects.Image} answerOutline 
     */
    #onClick = (selectedAnswer, answerOutline) =>  {
        this.#answersContainer.each(container => {
            let outlineImage = container.list[0]; 
            let answerOutlineImage = container.list[1]; 
            let answerImage = container.list[2];
            outlineImage.setAlpha(0);
            answerOutlineImage.setAlpha(0);
            // Turn off the interactivity of each answer option 
            answerImage.disableInteractive(); 
        });

        answerOutline.setAlpha(1); 
        this.#scene.input.setDefaultCursor('default');

        // Check if the answer is correct
        if(selectedAnswer === this.#correctAnswer) {
            // Add 100 to the leaf count 
            this.#leafCount += 100; 
            this.#updateLeafCount(); 
        }
        else {
            this.#budsy.takeDamage(this.#checkBudsyHealth); 
        }

        // Go to the next question after a second 
        setTimeout(() => {
            this.setNextQuestion()
        }, 100);
    }

    #checkBudsyHealth = () => {
        if(this.#budsy.getCurrentHP() === 0) {
            console.log("game over");
            this.#quizStateMachine.setState(QUIZ_STATES.FINISHED); 
        }
    }

    /**
     * @param {{ [x: string]: any; }} answerImages
     * @param {any} answerCoordinates
     * @param {{ [x: string]: any; }} textObjects
     * @param {any} cornerCords
     * @param {{ add: (arg0: Phaser.GameObjects.Container) => void; }} answersContainer
     */
    #createAnswerOptions(answerImages, answerCoordinates, textObjects, cornerCords, answersContainer) {
        // Loop through each answer from 1 to 4 (assuming you have 4 answers)
        for (let i = 1; i <= 4; i++) {
            // Get the corresponding data for this answer
            let answerImage = answerImages[`answer${i}`];
            let answerCords = answerCoordinates[`answer${i}Cords`];
            let textObject = textObjects[`textObject${i}`];
            let cornerCoord = cornerCords[i];

            // Calculate coordinates based on cornerCords
            let x = cornerCoord.x;
            let y = cornerCoord.y;

            // Get the selected item based on the answerOption 
            let outline = this.#scene.add
                .image(-12.5, -12, UI_ASSET_KEYS.SELECTED)
                .setScale(0.75,0.9)
                .setOrigin(0)
                .setAlpha(0);

            let answerOutline;
            // Check if the current answer is correct
            if(textObject.text === this.#correctAnswer) {
                answerOutline = this.#scene.add
                    .image(-12.5, -12, UI_ASSET_KEYS.SELECTED_CORRECT)
                    .setScale(0.75,0.9)
                    .setOrigin(0)
                    .setAlpha(0);
            }
            else {
                answerOutline = this.#scene.add
                    .image(-12.5, -12, UI_ASSET_KEYS.SELECTED_INCORRECT)
                    .setScale(0.75,0.9)
                    .setOrigin(0)
                    .setAlpha(0);
            }
            
            // Check if the option is right hand or not 
            if (i % 2 === 0) {
                outline.setOrigin(1,0).setX(12.5)
                answerOutline.setOrigin(1,0).setX(12.5)
            }

            // Create container and add answer image and text
            let answerContainer = this.#scene.add.container(x, y, 
                [
                    outline,
                    answerOutline,
                    answerImage, 
                    textObject.setX(answerCords.textX).setY(answerCords.textY)
                ]);

            
            // Make the container interactive
            answerImage.setInteractive();
            answerImage.on(Phaser.Input.Events.POINTER_OVER, () => {
                this.#onHover(outline);
            });
            
            answerImage.on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.#onClick(textObject.text, answerOutline);
            });
            answerImage.on(Phaser.Input.Events.POINTER_OUT, () => {
                this.#outOfHover(outline);
            });

            // Add answer container to answers container
            answersContainer.add(answerContainer);
        }
    }

    /**
     * @param {number} answerNum
     * @param {number} answerDisplayHeight
     * @param {number} answerDisplayWidth
     * @param {number} textObjHeight
     * @param {number} textObjWidth
     */
    #calcAnswerCords(answerNum, answerDisplayHeight, answerDisplayWidth, textObjHeight, textObjWidth){

        let textY = ((answerDisplayHeight - 10) - textObjHeight) / 2;
        let textX = 0; 

        // Check whether this answer is left or right by checking whether the 
        // answer number is even or odd 
        if (answerNum % 2 === 0) {
            // Calculate the vertical and horizontal positioning according to the 
            // "right-hand" position 
            textX = -(((answerDisplayWidth + 5) - textObjWidth)/2 + textObjWidth); 
        }
        else {
            textX = ((answerDisplayWidth - 10) - textObjWidth)/2; 
        }
        return {textX, textY}
    }

    /**
     * @param {string | string[]} questionText
     */
    #addQuestionContainer(questionText) {
        // Add in the question container
        const question = this.#scene.add
            .image(0, 0, UI_ASSET_KEYS.QUESTION)
            .setOrigin(0)
            .setScale(0.80, 0.85);

        // Create the text object with word wrapping
        let textObject = this.#scene.add.text(20, 0, questionText, {
            wordWrap: { width: (question.displayWidth - 50), useAdvancedWrap: true },
            color: "#3f76a8",
            fontSize: '20px',
            fontFamily: BAKSOSAPIO_LIGHT
        }).setOrigin(0);

        // Calculate the height of the text after wrapping
        let textHeight = textObject.height;

        // Calculate the vertical position to center the text
        let textY = ((question.displayHeight - 10) - textHeight) / 2;

        // Create a container and add both the question and text to it
        this.#questionContainer = this.#scene.add.container(40, 582 - question.displayHeight * 1.5,
            [
                question,
                textObject.setY(textY).setX(20)
            ],
        );
    }

    #homeBtnOnHover = () => {
        console.log("hover")
        this.#scene.input.setDefaultCursor('pointer');
        this.#homeBtn.setTexture(UI_ASSET_KEYS.HOME_BTN_HOVER)
    }
    
    #homeBtnOnClick = () => {
        // Go to title scene
        // Reset the quiz scene before entering the title scene
        this.#quizStateMachine.setState(QUIZ_STATES.RESET);
        this.#scene.cameras.main.fadeOut(600, 0, 0, 0);
        this.#scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.#scene.scene.start(SCENE_KEYS.TITLE_SCENE);
            console.log("Go back to home")
        });
    }
    
    #homeBtnOutOfHover = () => {
        this.#scene.input.setDefaultCursor('default');
        this.#homeBtn.setTexture(UI_ASSET_KEYS.HOME_BTN)
    }

    #addMenuHeader(){
        this.#homeBtn = this.#scene.add
            .image(0,0, UI_ASSET_KEYS.HOME_BTN)
            .setOrigin(0)
            .setScale(0.3)

        // Make the home button interactive 
        this.#homeBtn.setInteractive(); 
        this.#homeBtn.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.#homeBtnOnHover();
        });
        this.#homeBtn.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.#homeBtnOnClick();
        });
        this.#homeBtn.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.#homeBtnOutOfHover();
        });
        

        const questionCount = this.#scene.add
            .image(0,0, UI_ASSET_KEYS.QUESTION_COUNT_BG)
            .setOrigin(0)
            .setScale(0.3)
        
        this.#questionCountText = this.#scene.add.text(0, 0, `Question ${this.#questionCount} of 10`, {
            color: "#fff",
            fontSize: "14px",
            fontFamily: BAKSOSAPIO_LIGHT
        }).setOrigin(0);

        // Calculate the vertical position to center the text
        let questionTextY = ((questionCount.displayHeight) - this.#questionCountText.height) / 2;
        let questionTextX = ((questionCount.displayWidth) - this.#questionCountText.width) / 2;
         
        // Create a container for the question count 
        const questionCountContainer = this.#scene.add.container(this.#homeBtn.displayWidth*3.25 + 40,20,[
            questionCount,
            this.#questionCountText.setY(questionTextY).setX(questionTextX)
        ]);

        
        const leafCount = this.#scene.add   
        .image(0,0, UI_ASSET_KEYS.LEAF_COUNT)
        .setOrigin(1,0)
        .setScale(0.3)       

        this.#leafCountText = this.#scene.add.text(-10, 0, `${this.#leafCount}`, {
            color: "green",
            fontSize: "14px",
            fontFamily: BAKSOSAPIO_LIGHT
        }).setOrigin(1,0);

        // Calculate the vertical position to center the text
        let leafTextY = ((leafCount.displayHeight) - this.#leafCountText.height) / 2;
        
        const leafCountContainer = this.#scene.add.container(this.#scene.sys.game.canvas.width - 80,0,[
            leafCount,
            this.#leafCountText.setY(leafTextY)
        ]);
        
        // Create the text object for the question count 
        this.#scene.add.container(40,20, [
            this.#homeBtn, 
            questionCountContainer,
            leafCountContainer, 
        ]); 
    }

    #updateQuestionCountText() {
        if(this.#questionCountText)
            this.#questionCountText.setText(`Question ${this.#questionCount} of 10`); 
    }

    #updateLeafCount() {
        if(this.#leafCountText)
            this.#leafCountText.setText(`${this.#leafCount}`); 
    }

}