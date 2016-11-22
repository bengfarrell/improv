import Metronome from './objects/metronome.es6';
import CircularKeyboard from './objects/keyboards/circularkeyboard.es6';
import TraditionalKeyboard from './objects/keyboards/traditionalkeyboard.es6';
import Dome from './objects/dome.es6';
import FloatingParticles from './objects/floatingparticles.es6';
import Lighting from './objects/lighting.es6';
import TonePlayback from './toneplayback.es6';
import Input from './input.es6';

export default class Improv {
    constructor(scene, configURI) {
        this._scene = scene;
        this._request = new XMLHttpRequest();
        this._request.onreadystatechange = () => this.onConfigLoaded();
        this._request.open('GET', configURI);
        this._request.send();
    }

    /**
     * on key change
     * @param keys
     */
    onKeyInputChange(event) {
        this._keyboard.toggleKeyPressed({
            notation: event.changed.notation,
            octave: event.changed.octave,
            velocity: event.changed.velocity });

        //this._keyboard.toggleKeyPressed(key[octave], event.changed.velocity);
         /*var key = this.findKeyObjectsForNotation(event.changed.notation);
         var octave;
         if (event.changed.octave / 2 === Math.floor(event.changed.octave / 2)) {
            octave = 1;
         } else {
            octave = 0;
         }

         this.toggleKeyPressed(key[octave], event.changed.velocity);

         if (event.predictedKey.length > 0 && event.predictedKey[0] !== this.currentKeySignature) {
            this.onKeySignatureChange(event.predictedKey[0].key);
         }*/
     }


    /**
     * on config loaded
     */
    onConfigLoaded() {
        if (this._request.readyState === XMLHttpRequest.DONE) {
            if (this._request.status === 200) {
                var config = JSON.parse(this._request.responseText);
                this.setup(config);
            } else {
                console.log('There was a problem with the request.');
            }
        }
    }
    /**
     * setup app
     * @param config
     * @param config
     */
    setup(config) {
        this._scene.onCreate = this.create;

        this._input = new Input(config.input, (keys) => this.onKeyInputChange(keys) );
        this._keyboard = new TraditionalKeyboard(config.keyboard);
        this._hudKeyboard = new CircularKeyboard(config.notationdisplay);

        this._scene.addObjects([
            new Metronome(),
            new FloatingParticles(),
            new Dome(),
            this._keyboard,
            this._hudKeyboard,
            new Lighting() ]);

        for (var c = 0; c < config.sound.soundfonts.length; c++) {
            TonePlayback.loadInstrument(config.sound.soundfonts[c], config.sound.soundfontlocation);
        }
        document.addEventListener('keydown', event => this.onKeyDown(event) );
    }

    /**
     * on keydown
     * @param event
     */
    onKeyDown(event) {
        if (event.code === 'Space') {
            switch (TonePlayback.playerState) {
                case 'ready': TonePlayback.play('./assets/audio/Bonnie_Tyler_-_Total_Eclipse_of_the_Heart.mid'); break;
                case 'playing': TonePlayback.pause(); break;
                case 'paused': TonePlayback.resume(); break;
            }
        }
    }

    create(scene, custom) {
        scene.renderer.gammaInput = true;
        scene.renderer.gammaOutput = true;
    }

    render(scene, custom) {}
}
