class AudioEQSpetrum {
  constructor() {
    this.bars = null;
    this.audio = null;
    this.context = null;
    this.eqBars = null;
  }

  init(audio, barElms) {
    this.eqBars = barElms;
    let context = new AudioContext();
    this.analyser = context.createAnalyser();

    let source = context.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(context.destination);
  }

  getFreqData() {
    let fbcBytes = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(fbcBytes);
    return fbcBytes;
  }
}

const MAX_BAR_COUNT = 100;

function drawSpectrum() {
  window.RequestAnimationFrame = window.requestAnimationFrame(drawSpectrum);

  let fbcBytes = g_audioEqsp.getFreqData();
  for (let i = 0; i < MAX_BAR_COUNT; i++) {
    g_audioEqsp.eqBars[i].style.height = Math.floor(fbcBytes[i] * 150 / 256) + 'px';
  }
}

function initAudioEQSpectrum(audio, elmId) {
  if( !g_audioEqsp ) {
    let eqspBoxWidth = Number($(`#${elmId}`).css('width').replace('px', '')) - 40;  // 20 padding
    let barWidth = Math.floor(eqspBoxWidth / MAX_BAR_COUNT) - 2;
    for(let i=0; i<MAX_BAR_COUNT; i++ ) {
      $(`#${elmId}`).append(`<div style="width: ${barWidth}px"></div>`)
    }

    g_audioEqsp = new AudioEQSpetrum();
    g_audioEqsp.init(audio , $(`#${elmId} > div`));
    drawSpectrum();
  }
  else {
    try {
      g_audioEqsp.context.resume();
    }
    catch(e) {

    }
  }
}

let g_audioEqsp = null;