export class AudioManager {
    constructor() {
        this.backgroundMusic = new Audio("./assets/sounds/slime-song-2.mp3");
        // this.backgroundMusic = new Audio("./assets/sounds/slime-song-3.mp3");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.2;

        this.soundEffects = {
            jump: new Audio('./assets/sounds/slime-jump-1.mp3'),
        //     die: new Audio('sounds/collect.mp3'),
        };
    };

    playMusic() {
        this.backgroundMusic.play();
    }

    stopMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    playSound(soundName) {
        // Clone the audio to allow overlapping sounds
        const sound = this.soundEffects[soundName].cloneNode();
        sound.volume = 0.5;
        sound.play();
    }

}