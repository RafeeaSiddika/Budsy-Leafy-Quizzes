import { BAKSOSAPIO_LIGHT } from "../../../assets/font-keys.js";
import Phaser from "../../../lib/phaser.js";

/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
export const ANSWER_UI_TEXT_STYLE = Object.freeze({
    fontFamily: BAKSOSAPIO_LIGHT,
    wordWrap: { width: 239.75, useAdvancedWrap: true },
    fontSize:"15px"
}); 