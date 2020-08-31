class Music {
    constructor() {
        this.musicArr = [];
        this.loaded = false;
        $.getJSON("music_list.json").done(MArr => {
           MArr.forEach(MValue => {
               this.putMusic(MValue);
           });

           console.log(this.musicArr);
            this.loaded = true;
            this.getAudioDurationAll();
        }).fail(msg => {console.log(msg)});

    }

    getRandomMusics() {
        let arr = [];
        let numArr = [];
        while (numArr.length < 4) {
            let randomNum = Math.floor(Math.random()*this.musicArr.length);
            let isSame = numArr.findIndex(v => v == randomNum);
            if(isSame < 0) {
                numArr.push(randomNum);
            }
        }

        numArr.forEach( num => {
            arr.push(this.getMusicOfIdx(num)[0]);
        });
        return arr;
    }

    getMusicOfIdx(idx) {
        // 한개의 값이 들은 배열이 옴.
        let music = this.musicArr.filter(v => v.idx == idx);
        return music;
    }

    getBalladeMusics() {
        let balladArr = this.musicArr.filter(v => v.genre == "발라드");

        balladArr.splice(4);
        return balladArr;
    }

    putMusic(newMusic) {
        this.musicArr.push(newMusic);
    }

    audioLoadAndGetDuration(url) {
        return new Promise((resolve, reject) => {
            let audio = new Audio();
            audio.src = url;
            audio.onloadeddata = () => resolve(audio.duration);
            // setTimeout(() => resolve(0), 5000);
        });
    }

    getAudioDurationAll() {
        this.musicArr.forEach( async musicData => {
            console.log("getAudioDuration():", musicData.url);
            try {
                musicData.duration = await this.audioLoadAndGetDuration('music/' +  encodeURI(musicData.url));
            }
            catch(e) {
                console.log("getAudioDurationAll", e);
                musicData.duration = -1;
            }
        });
    }
}
let g_Music = new Music();