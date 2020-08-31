class List {
    constructor() {
        this.listArr = [];
        this.loaded = false;
        $.getJSON("playlists.json").done(LArr => {
            LArr.list.forEach(LValue => {
                this.putListMusic(LValue);
            });

            console.log(this.listArr);
            this.loaded = true;
        }).fail(errMsg => {console.log(errMsg)});
    }

    getListsAll() {
        let arr = JSON.parse(JSON.stringify(this.listArr));
        let addMusicsListArr = [];
        arr.forEach(listValue => {
            listValue.list = listValue.list.map(listNum => g_Music.getMusicOfIdx(listNum)[0]);
            // listValue.list.forEach(listNum => {
            //     //list 속 번호들을 가지고 music 에서 가져온뒤 임시 저장
            //     addMusicsListArr.push(g_Music.getMusicOfIdx(listNum)[0]);
            // });
            // $(listValue.list).empty();
            // listValue.list = addMusicsListArr;
            // addMusicsListArr = [];
        });
        // console.log(arr);
        return arr;
    }

    getListNumsAll(idx) {
        return this.listArr[idx];
    }


    getListMusics(listIdx) {
        let JList = JSON.parse(JSON.stringify(this.listArr));

        JList[listIdx].list = JList[listIdx].list.map(v => g_Music.getMusicOfIdx(v)[0]);

        // console.log(JList);
        return JList[listIdx];
    }


    getMusicCountOfList(idxNum) {
        let list = this.listArr[idxNum];
        return list.list.length;
    }

    deleteMusicOnList(listNum, musicNum) {
        let numList = this.listArr.filter(v => v.idx == listNum);

        let listMusic = numList[0].list.findIndex(v => v == musicNum);
        numList[0].list.splice(listMusic, 1);

        // console.log(numList[0].list);
    }

    putMusicOnList(listNum, musicNum) {
        let numList = this.listArr.filter(v => v.idx == listNum);

        numList[0].list.push(musicNum);
        // console.log(numList[0].list);
    }

    putListMusic(newListMusic) {
        this.listArr.push(newListMusic);
    }
}

let g_List = new List();