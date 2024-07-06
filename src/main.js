import Phaser from './lib/phaser.js';
import { PreLoadScene } from './scenes/preload-scene.js';
import { QuizScene } from './scenes/quiz-scene.js';
import { SCENE_KEYS } from './scenes/scene-keys.js';
import { TitleScene } from './scenes/title-scene.js';

const game = new Phaser.Game({
    type: Phaser.CANVAS, 
    pixelArt: false,
    parent: 'game-container', 
    scale: {
        parent:'game-container', 
        width: 1024, 
        height:576, 
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }, 
    backgroundColor: '#000000'
}); 

// Create the preload scene
game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreLoadScene); 
game.scene.add(SCENE_KEYS.QUIZ_SCENE, QuizScene); 
game.scene.add(SCENE_KEYS.TITLE_SCENE, TitleScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE)