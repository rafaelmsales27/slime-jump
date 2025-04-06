export class InputHandler {
    constructor() {
      this.keys = {};
      this.previousKeys = {};
      
      window.addEventListener('keydown', (e) => {
        this.keys[e.key.toLowerCase()] = true;
      });
      
      window.addEventListener('keyup', (e) => {
        this.keys[e.key.toLowerCase()] = false;
      });
      
      // Mobile touch support
      window.addEventListener('touchstart', () => {
        this.keys['touch'] = true;
      });
      
      window.addEventListener('touchend', () => {
        this.keys['touch'] = false;
      });
    }
  
    isKeyDown(key) {
      return !!this.keys[key.toLowerCase()];
    }
  
    // Check if key was just pressed (not held)
    isKeyPressed(key) {
      const keyLower = key.toLowerCase();
      const wasPressed = this.keys[keyLower] && !this.previousKeys[keyLower];
      this.previousKeys[keyLower] = this.keys[keyLower];
      return wasPressed;
    }
  
    update() {
      this.previousKeys = {...this.keys};
    }
  }
  
  // Create single instance (Singleton)
  export const input = new InputHandler();