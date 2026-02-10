
class AudioSystem {
    private ctx: AudioContext | null = null;
    private isEnabled: boolean = true;

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    private createOscillator(freq: number, type: OscillatorType = 'sine', startTime: number, duration: number, volume: number = 0.2) {
        if (!this.ctx || !this.isEnabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playClick() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.createOscillator(800, 'square', now, 0.05, 0.05);
    }

    playWordFound() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.createOscillator(440, 'sine', now, 0.3, 0.1); // A4
        this.createOscillator(554.37, 'sine', now + 0.1, 0.3, 0.1); // C#5
        this.createOscillator(659.25, 'sine', now + 0.2, 0.4, 0.1); // E5
    }

    playLevelComplete() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            this.createOscillator(freq, 'triangle', now + i * 0.1, 0.6, 0.15);
        });
    }

    playTrophy() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < 10; i++) {
            this.createOscillator(1000 + (Math.random() * 2000), 'sine', now + i * 0.05, 0.1, 0.05);
        }
        this.playLevelComplete();
    }

    playHint() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.createOscillator(1200, 'sine', now, 0.1, 0.1);
        this.createOscillator(1500, 'sine', now + 0.05, 0.15, 0.08);
    }
}

export const audioSystem = new AudioSystem();
