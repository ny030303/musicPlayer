class Queue {
    constructor() {
        this.QueueArr = [];
        this.nowMusic = null;
        this.isQueueLoop = false;
    }

    changeQueueLoop() {
        if(this.isQueueLoop == false) {
            this.isQueueLoop = true;
        } else {
            this.isQueueLoop = false;
        }
    }

    getQueueLoop() {
        return this.isQueueLoop;
    }

    setNowMusicInfo(queueMusic) {
        this.nowMusic = queueMusic;
    }

    deleteQueueArr() {
        this.QueueArr = [];
    }

    deleteQueueMusic(musicNum) {
        let musicIdx = this.QueueArr.findIndex(v => v == Number(musicNum));
        this.QueueArr.splice(musicIdx, 1);
    }

    getNowMusic() {
        return this.nowMusic;
    }

    getQueueArrLength() {
        return this.QueueArr.length;
    }

    getQueueMusicsAll() {
        let arr = JSON.parse(JSON.stringify(this.QueueArr));

        arr = arr.map(v => g_Music.getMusicOfIdx(v)[0]);

        return arr;
    }

    getQueueMusic(queueNum) {
        return g_Music.getMusicOfIdx(this.QueueArr[queueNum])[0];
    }

    getBeforeQueueMusic() {
        let nowMusicIdx = this.QueueArr.findIndex(v => v == Number(this.nowMusic));

        return g_Music.getMusicOfIdx(this.QueueArr[nowMusicIdx-1])[0];
    }

    getAfterQueueMusic() {
        let nowMusicIdx = this.QueueArr.findIndex(v => v == Number(this.nowMusic));

        return g_Music.getMusicOfIdx(this.QueueArr[nowMusicIdx+1])[0];
    }

    putNextQueueMusic(musicNum) {
        let nowMusicIdx = this.QueueArr.findIndex(v => v == Number(this.nowMusic));
        this.QueueArr.splice(nowMusicIdx+1,0,musicNum);
    }

    putQueueMusic(newQueueMusicNum) {
        let check = this.QueueArr.findIndex(v=> v == newQueueMusicNum);
        if(check >= 0) {
            // nothing
            this.QueueArr.splice(check,1);
        }
        this.QueueArr.push(newQueueMusicNum);
    }
}

let g_Queue = new Queue();