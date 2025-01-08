import { Csound } from '@csound/browser';

class AudioApp {
  private csound: Csound | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.initializeAudio();
      this.setupClickHandler();
    } catch (error) {
      console.error('Audio initialization failed:', error);
      this.createRetryButton();
    }
  }

  private setupClickHandler(): void {
    document.addEventListener('click', async () => {
      if (this.isInitialized) {
        await this.playSound();
      }
    });
  }

  private createRetryButton(): void {
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry Audio Initialization';
    retryButton.style.position = 'fixed';
    retryButton.style.top = '20px';
    retryButton.style.left = '20px';
    
    retryButton.onclick = async () => {
      try {
        await this.initialize();
        retryButton.remove();
      } catch {
        retryButton.textContent = 'Failed - Try again';
      }
    };

    document.body.appendChild(retryButton);
  }

  private async initializeAudio(): Promise<void> {
    this.csound = await Csound();
    await this.csound.setOption('-odac');            
    
    const csdContent = `
<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>
sr = 48000
ksmps = 128
nchnls = 2
0dbfs = 1

instr 1
  iamp = p4
  ifreq = p5
  
  aenv = linen:a(iamp, 0.1, p3, 0.1)
  asig = oscili:a(aenv, ifreq)
  outs asig, asig
endin
</CsInstruments>
<CsScore>
</CsScore>
</CsoundSynthesizer>
`;

    await this.csound.compileCsdText(csdContent);
    await this.csound.start();
    await this.playSound();
    this.isInitialized = true;
  }

  private async playSound(): Promise<void> {
    if (!this.csound) return;
    const frequency = 220 + Math.random() * 660;
    await this.csound.inputMessage(`i 1 0 2 0.5 ${frequency}`);
  }

  public dispose(): void {
    if (this.csound) {
      this.csound.stop();
      this.csound = null;
    }
  }
}

new AudioApp();
