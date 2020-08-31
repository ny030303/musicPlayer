let g_nowlyricsList = [];

function setHomeRecommendMusics() {
    let recommendMusicWrap = $("#recommendWrap").find(".musicsWrap");
    let RandomMusics = g_Music.getRandomMusics();
    recommendMusicWrap.empty();
    RandomMusics.forEach(RandomMusic => {
        let div = `<div class="mainMusic" data-idx="${RandomMusic.idx}">
                            <div class="musicImage" style="background-image: url(${"covers/" + RandomMusic.albumImage})">
                                <i class="fas fa-play mainIStyle" data-midx="${RandomMusic.idx}"></i>
                            </div>
                            <div class="titleStyle">${RandomMusic.name}</div>
                            <div class="artistStyle">${RandomMusic.artist}</div>
                        </div>`;
        recommendMusicWrap.append(div);
    });

    $("#recommendWrap .mainMusic .fa-play").on("click", function (e) {
        if (g_Queue.getQueueArrLength() <= 0) {
            g_Queue.setNowMusicInfo(e.target.dataset.midx);
            putMusicOnAudio(e.target.dataset.midx);
        }
        putMusicOnQueue(e.target.dataset.midx);
        alert("해당 곡을 추가했습니다.");
    });

    makeContextmemuEvent($("#recommendWrap .mainMusic"), `<div>플레이리스트에 추가</div>
                                                             <div>다음 음악으로 재생</div>
                                                             <div>대기열에 추가</div>`);
}

function setHomeBalladeMusics() {
    let balladeMusicWrap = $("#balladeWrap").find(".musicsWrap");
    let RandomMusics = g_Music.getBalladeMusics();
    balladeMusicWrap.empty();
    RandomMusics.forEach(RandomMusic => {
        let div = `<div class="mainMusic" data-idx="${RandomMusic.idx}">
                            <div class="musicImage" style="background-image: url(${"covers/" + RandomMusic.albumImage})" >
                                <i class="fas fa-play mainIStyle" data-midx="${RandomMusic.idx}"></i>
                            </div>
                            <div class="titleStyle">${RandomMusic.name}</div>
                            <div class="artistStyle">${RandomMusic.artist}</div>
                        </div>`;
        balladeMusicWrap.append(div);
    });

    $("#balladeWrap .mainMusic .fa-play").on("click", function (e) {
        if (g_Queue.getQueueArrLength() <= 0) {
            g_Queue.setNowMusicInfo(e.target.dataset.midx);
            putMusicOnAudio(e.target.dataset.midx);
        }
        putMusicOnQueue(e.target.dataset.midx);
        alert("해당 곡을 추가했습니다.");
    });

    makeContextmemuEvent($("#balladeWrap .mainMusic"), `<div>플레이리스트에 추가</div>
                                                             <div>다음 음악으로 재생</div>
                                                             <div>대기열에 추가</div>`);
}

function makeContextmemuEvent(section, divIn) {
    section.on("contextmenu", function (e) {
        e.preventDefault();
        if ($(".contextmenu").length >= 1) {
            $(".contextmenu").remove();
        }
        let parentSection = $(e.target).hasClass("fa-play") ? $(e.target).parent().parent() : $(e.target).parent();
        console.log(parentSection[0].dataset.idx);
        // console.log(e.pageX, e.pageY);

        let p = document.createElement("p");
        p.classList.add("contextmenu");

        let div2 = divIn;
        $(p).append(div2);
        $(e.target).parent().parent().parent().append(p);

        let x = e.pageX + 'px';
        // let y = (e.pageY - $(window).scrollTop()) + 'px';
        let y = e.pageY + 'px';
        p.style.left = x;
        p.style.top = y;
        p.style.display = "block";

        $(".contextmenu").find("div").on("click", function (e) {
            console.log($(e.target).html());
            switch ($(e.target).html()) {
                case "플레이리스트에 추가":
                    $(".popupListWrap").empty();
                    g_List.getListsAll().forEach((list, idx) => {
                        let div = `<div class="popupList" data-lidx="${list.idx}">
                                        <input type="checkbox" class="popupListContent">
                                        <div class="popupListContent">${list.maker + "(" + list.idx + ")"}</div>
                                    </div>`;
                        $(".popupListWrap").append(div);
                        let check = list.list.findIndex(v => v.idx == parentSection[0].dataset.idx);
                        if (check >= 0) {
                            $(".popupList input")[idx].checked = true;
                        }
                    });
                    $(".myListPopup").slideDown("fast");

                    $(".popupList input").on("click", function (e) {
                        if ($(e.target)[0].checked == true) {
                            // console.log("체크 됨");
                            // console.log($(e.target).parent()[0].dataset.lidx);
                            g_List.putMusicOnList($(e.target).parent()[0].dataset.lidx, Number(parentSection[0].dataset.idx));
                            alert("해당 리스트에 음악이 추가 됐습니다.");
                        } else {
                            // console.log("체크 취소");
                            g_List.deleteMusicOnList($(e.target).parent()[0].dataset.lidx, Number(parentSection[0].dataset.idx));
                            alert("해당 리스트에 음악이 삭제 됐습니다.");
                        }
                    });
                    break;
                case "다음 음악으로 재생":
                    if (g_Queue.getQueueArrLength() <= 0) {
                        g_Queue.setNowMusicInfo(parentSection[0].dataset.idx);
                        putMusicOnAudio(parentSection[0].dataset.idx);
                    }

                    g_Queue.putNextQueueMusic(parentSection[0].dataset.idx);
                    break;
                case "대기열에 추가":
                    if (g_Queue.getQueueArrLength() <= 0) {
                        g_Queue.setNowMusicInfo(parentSection[0].dataset.idx);
                        putMusicOnAudio(parentSection[0].dataset.idx);
                    }
                    g_Queue.putQueueMusic(parentSection[0].dataset.idx);
                    break;
                case "대기열에서 삭제":
                    g_Queue.deleteQueueMusic(parentSection[0].dataset.idx);
                    setQueuePage();
                    break;
                case "플레이리스트에서 삭제":

                    break;
                case "플레이리스트 삭제":
                    g_List.deleteMusicOnList($(".listTitleStyle span .fa-play")[0].dataset.idx, parentSection[0].dataset.idx);
                    break;
                case "플레이리스트 재생":
                    $(".listTitleStyle span .fa-play").click();
                    break;
            }
        });
    });
}

function setMyList() {
    let libMyList = $("#libMyList");
    let libMyListsInfo = g_List.getListsAll();

    libMyList.empty();
    libMyListsInfo.forEach((listMusic, idx) => {
        let count = g_List.getMusicCountOfList(idx);
        let div = `<div class="listMusic" data-idx="${idx}">
                        <p class="musicImage1" style="background-image: url(${"covers/" + listMusic.list[0].albumImage})"></p>
                        <div class="musicTitle">${listMusic.maker + "(" + idx + ")"}</div>
                        <div class="musicText">곡 수: ${count}곡</div>
                        <div>
                            <i class="fas fa-play subIconStyle" data-idx="${idx}"></i>
                        </div>
                    </div>`;
        libMyList.append(div);
    });

    makeContextmemuEvent($("#libMyList .listMusic"), `<div>플레이리스트에 추가</div>
                                                            <div>다음 음악으로 재생</div>
                                                            <div>대기열에 추가</div>
                                                            <div>플레이리스트에서 삭제</div>`);

    //list 클릭했을때 이벤트
    libMyList.find(".listMusic").on("click", function (e) {
        // e.target.dataset.idx;
        if ($(e.target).hasClass("fa-play")) return;
        let target = (!$(e.target).hasClass("listMusic")) ? $(e.target).parent()[0] : e.target;
        // console.log(e.target);
        let clickListInfo = g_List.getListMusics(target.dataset.idx);
        let count = g_List.getMusicCountOfList(target.dataset.idx);
        $("#playList .listTitleStyle").empty();
        $("#playList .libList").empty();

        let title = `LIST MUSIC<br>
        <span>곡 수: ${count}개<i class="fas fa-play subIconStyle" style="margin: 0 0 0 30px" data-idx="${target.dataset.idx}"></i></span>`;
        $("#playList .listTitleStyle").append(title);

        clickListInfo.list.forEach(music => {
            let div = `<div class="listMusic" data-idx="${music.idx}">
                        <p class="musicImage1" style="background-image: url(${"covers/" + music.albumImage})"></p>
                        <div class="musicTitle">${music.name}</div>
                        <div class="musicText">${music.artist}</div>
                        <div class="musicText">${music.albumName}</div>
                        <div>
                            <i class="fas fa-folder-plus subIconStyle putQueueBtn" data-midx="${music.idx}"></i>
                        </div>
                    </div>`;
            $("#playList .libList").append(div);


        });

        makeContextmemuEvent($("#playList .libList .listMusic"), `<div>플레이리스트 재생</div>
                                                                           <div>플레이리스트에 추가</div>
                                                                            <div>다음 음악으로 재생</div>
                                                                            <div>대기열에 추가</div>
                                                                            <div>플레이리스트 삭제</div>`);

        $(".libList").removeClass("libActive");
        $("#playList .libList").addClass("libActive");

        $("section").removeClass("sectActive");
        $("#playList").addClass("sectActive");


        $("#playList .listTitleStyle span .fa-play").on("click", function (e) {
            g_Queue.deleteQueueArr();
            console.log("들어옴");
            let listMusicInfo = g_List.getListNumsAll(e.target.dataset.idx);
            listMusicInfo.list.forEach(musicNum => {
                putMusicOnQueue(musicNum);
            });

            putMusicOnAudio(g_Queue.getQueueMusic(0).idx);
            alert("기존 대기열을 지우고 리스트 곡들을 추가했습니다.")
        });

        $(".putQueueBtn").on("click", function (e) {
            if (g_Queue.getQueueArrLength() <= 0) {
                g_Queue.setNowMusicInfo(e.target.dataset.midx);
                putMusicOnAudio(e.target.dataset.midx);
            }
            putMusicOnQueue(e.target.dataset.midx);
            alert("해당 곡을 추가했습니다.");
        });

    });

    //list 플레이 버튼 이벤트
    libMyList.find(".fa-play").on("click", function (e) {

        g_Queue.deleteQueueArr();

        let listMusicInfo = g_List.getListNumsAll(e.target.dataset.idx);
        listMusicInfo.list.forEach(musicNum => {
            putMusicOnQueue(musicNum);
        });

        putMusicOnAudio(g_Queue.getQueueMusic(0).idx);
        alert("기존 대기열을 지우고 리스트 곡들을 추가했습니다.")
    });
}

function setQueuePage() {
    let musicInfos = g_Queue.getQueueMusicsAll();
    let queueList = $("#queueList");

    queueList.empty();

    let playIdx = g_Queue.getNowMusic();
    musicInfos.forEach(music => {
        let div = `<div class="queueMusic ${playIdx == music.idx ? 'queueMusicActive' : ''}" data-idx="${music.idx}">
                        <p class="musicImage1" style="background-image: url(${"covers/" + music.albumImage})"></p>
                        <div class="queueMTitle">${music.name}</div>
                        <div class="queueMText">${music.artist}</div>
                        <div class="queueMText">${music.albumName}</div>
                        <div class="queueMText">${playTimeToTimeStr(music.duration)}</div>
                    </div>`;
        queueList.append(div);
    });
    makeContextmemuEvent($("#queueList .queueMusic"), `<div>플레이리스트에 추가</div>
                                                             <div>대기열에서 삭제</div>`);

    $("#queueList .queueMusic").on("click", function (e) {
        let target = ($(e.target).hasClass("queueMusic")) ? $(e.target) : $(e.target).parent();

        putMusicOnAudio(target[0].dataset.idx);
    });


    let queueCheck = setInterval(function (e) {
        if (playIdx != g_Queue.getNowMusic()) {
            playIdx = g_Queue.getNowMusic();
            $(".queueMusic").removeClass('queueMusicActive');
            $(".queueMusic").each((i, elm) => elm.dataset.idx == playIdx ? $(elm).addClass('queueMusicActive') : console.log(''));
        }
        if ($('#queue').css('display') != 'block') {
            clearInterval(queueCheck);
        }
    }, 200);
}

function playTimeToTimeStr(playTime) {
    let ptime = new Date(Number(playTime || 0) * 1000);
    return ptime.toISOString().substr(14, 5);
}


function setAudioEvent() {
    let audio = $("audio");
    // 실행버튼 이벤트
    $("#playBtn").on("click", function (e) {
        // console.log("aaddd");
        if (audio[0].paused) {
            // 오디오가 안켜져있다.
            $(e.target).removeClass("fa-play");
            $(e.target).addClass("fa-pause");
            audio[0].play();
        } else {
            $(e.target).removeClass("fa-pause");
            $(e.target).addClass("fa-play");
            audio[0].pause();
        }
    });

    // 음악 시간 체크
    let mpBar = $("#mpBar");
    let mpTimeWrap = $("#mpTimeWrap");
    let barPercent = 0;

    let prevLyrics = $("#prevLyrics");
    let nowLyrics = $("#nowLyrics");
    let nextLyrics = $("#nextLyrics");
    let MusicTimer = setInterval(function (e) {
        if (!audio[0].paused) {
            // console.log(audio[0].paused);
            barPercent = (audio[0].currentTime * 100) / audio[0].duration;
            // console.log(playTimeToTimeStr(audio[0].currentTime));
            mpTimeWrap.html(`${playTimeToTimeStr(audio[0].currentTime)} / ${playTimeToTimeStr(audio[0].duration)}`);

            mpBar.css({width: `${barPercent}%`});

            let playTimeMSec = Math.floor(audio[0].currentTime * 1000 + 500); // 0.5초 빨리 가사 불러오기

            let idx = g_nowlyricsList.findIndex(v => playTimeMSec >= v.start && playTimeMSec <= v.end);

            prevLyrics.html(g_nowlyricsList[idx - 1] ? g_nowlyricsList[idx - 1].text : " ");
            nowLyrics.html(g_nowlyricsList[idx] ? g_nowlyricsList[idx].text : " ");
            nextLyrics.html(g_nowlyricsList[idx + 1] ? g_nowlyricsList[idx + 1].text : " ");
        }

        if(audio[0].currentTime >= audio[0].duration) {
            if(g_Queue.getQueueLoop() == true) {
                $("#mpIconWrap .fa-step-forward").click();
            }
        }
    }, 30);


    // 음악 바 조절 이벤트
    let isMpBarDowning = false;

    function mpBarWrapEvent(e) {
        e.preventDefault();
        let percent = (e.offsetX * 100) / $("#mpBarWrap")[0].offsetWidth;
        // console.log(percent);
        switch (e.type) {
            case "mousedown":
                // 70 : 100 = ? : duration
                // audio[0].pause();
                mpBar.css({width: `${percent}%`});
                mpBar.removeClass('mpBarTransitionOn');
                audio[0].currentTime = (percent * audio[0].duration) / 100;
                isMpBarDowning = true;
                // audio[0].play();
                break;
            case "mousemove":
                if (isMpBarDowning) {
                    // audio[0].pause();
                    mpBar.css({width: `${percent}%`});
                    // $("#mpBarWrap").hover(() => $("#mpBar").css({height: "20px", transition: "0s"}));
                    audio[0].currentTime = (percent * audio[0].duration) / 100;

                    // audio[0].play();
                }
                break;
            case "mouseup":
                // mpBar.css({transition: ".6s"});
                mpBar.addClass('mpBarTransitionOn');
                isMpBarDowning = false;
                break;
        }
    }

    $("#mpBarWrap")[0].addEventListener("mousedown", mpBarWrapEvent);
    $("#mpBarWrap")[0].addEventListener("mousemove", mpBarWrapEvent);
    document.addEventListener("mouseup", mpBarWrapEvent);

// 볼륨 바 조절 이벤트
    let isVolumeBarDowning = false;
    let mpVolumeBar = $("#mpVolumeBar");

    function volumeBarWrapEvent(e) {
        e.preventDefault();
        let percent = (e.offsetX * 100) / $("#mpVolumeBarWrap")[0].offsetWidth;
        switch (e.type) {
            case "mousedown":
                // 70 : 100 = ? : 1
                mpVolumeBar.css({width: `${percent}%`});
                isVolumeBarDowning = true;
                audio[0].volume = [((percent * 1) / 100)].map(v => v < 0 ? 0 : ((v > 1) ? 1 : v))[0];
                break;
            case "mousemove":
                if (isVolumeBarDowning) {
                    mpVolumeBar.css({width: `${percent}%`});
                    audio[0].volume = [((percent * 1) / 100)].map(v => v < 0 ? 0 : ((v > 1) ? 1 : v))[0];
                }
                break;
            case "mouseup":
                isVolumeBarDowning = false;
                break;
        }
    }

    $("#mpVolumeBarWrap")[0].addEventListener("mousedown", volumeBarWrapEvent);
    $("#mpVolumeBarWrap")[0].addEventListener("mousemove", volumeBarWrapEvent);
    document.addEventListener("mouseup", volumeBarWrapEvent);

    // 가사 띄우기 이벤트
    let mpLyricsWrap = $("#mpLyricsWrap");
    $("#mpIconWrap .fa-bars").on("click", function (e) {
        if ($("#mpLyricsWrap").css("display") == "flex") {
            $("#mpLyricsWrap").css({display: "none"});
        } else {
            $("#mpLyricsWrap").css({display: "flex"});
        }
    });
}


function putMusicOnQueue(musicNum) {
    g_Queue.putQueueMusic(musicNum);
}

function putMusicOnAudio(musicNum) {
    let audio = $("audio");
    let musicInfo = g_Music.getMusicOfIdx(musicNum);

    audio[0].pause();
    $("#mpImage").css({"backgroundImage": `url(${"covers/" + musicInfo[0].albumImage})`});
    audio[0].src = encodeURI(`music/${musicInfo[0].url}`);
    audio[0].currentTime = 0;
    initAudioEQSpectrum(audio[0], 'queueNowEq');

    $("#mpBar").removeClass('mpBarTransitionOn');
    $("#mpBar").css({width: "0%"});
    setTimeout(() => $("#mpBar").addClass('mpBarTransitionOn'), 500);

    $("#musicName1").html(`${musicInfo[0].name}`);
    $("#musicName2").html(`${musicInfo[0].albumName}`);

    g_Queue.setNowMusicInfo(musicNum);
    let queueNowMusicImg = $("#queueNowMusic");
    queueNowMusicImg.css({backgroundImage: `url(${"covers/" + musicInfo[0].albumImage})`})

    if (musicInfo[0].lyrics != null) {
        let txtUrl = "lyrics/" + musicInfo[0].lyrics;
        $.get(txtUrl).done(res => {
            // console.log(res);
            let textTracks = res.split('\n\n');
            g_nowlyricsList = [];

            textTracks.forEach(text => {
                let texts = text.split('\n');
                if (texts.length > 2) {
                    let times = texts[1].split('-->');
                    g_nowlyricsList.push({
                        num: texts[0],
                        start: new Date(`1970-01-01 ${times[0].replace(",", ".")}Z`).getTime(),
                        end: new Date(`1970-01-01 ${times[1].replace(",", ".")}Z`).getTime(),
                        text: texts[2]
                    });
                }
            });
        });
    } else {
        g_nowlyricsList = [];
    }

    $("#playBtn").click();
}


window.onload = function () {
    let headerList = $("#header-list");
    setAudioEvent();
    headerList.find("a").on("click", function (e) {
        console.log("aa");
        //let inText = $(e.target).attr('class');
        if (e.target.dataset.sname != "queue") {
            $("#queue").fadeOut();
        }
        switch (e.target.dataset.sname) {
            case "home":
                setHomeRecommendMusics();
                setHomeBalladeMusics();
                $("section").removeClass("sectActive");
                $("#home").addClass("sectActive");
                break;
            case "library" :
                $(".libBtn1").click();
                $("section").removeClass("sectActive");
                $("#library").addClass("sectActive");
                break;
            case "queue":
                if ($("#queue").css('display') == "none") {
                    $("#mpQueueBtn").click();
                }
                break;
            case "login":
                $("section").removeClass("sectActive");
                $("#login").addClass("sectActive");
                break;
        }
    });
    $("#mpQueueBtn").on("click", function (e) {
        e.preventDefault();
        if ($("#queue").css('display') != "none") {
            $(e.target).css({color: "#aaa"});
            $("#queue").fadeOut();
        } else {
            setQueuePage();
            $(e.target).css({color: "#ff253a"});
            $("#queue").fadeIn();
        }
    });

    $("#mpIconWrap .fa-step-backward").on("click", function (e) {
        e.preventDefault();
        if ($("audio")[0].currentTime >= 5) {
            $("#mpBar").removeClass('mpBarTransitionOn');
            $("#mpBar").css({width: "0%"});
            setTimeout(() => $("#mpBar").addClass('mpBarTransitionOn'), 500);
            $("audio")[0].currentTime = 0;
        } else {
            if(g_Queue.getBeforeQueueMusic() == undefined) {

            } else {
                putMusicOnAudio(Number(g_Queue.getBeforeQueueMusic().idx));
            }
        }
    });

    $("#mpIconWrap .fa-step-forward").on("click", function (e) {
        e.preventDefault();

        if(g_Queue.getAfterQueueMusic() == undefined) {
            if(g_Queue.getQueueLoop() == true) {
                putMusicOnAudio(Number(g_Queue.getQueueMusic(0).idx));
            } else {
                // return;
            }
        } else {
            putMusicOnAudio(Number(g_Queue.getAfterQueueMusic().idx));
        }
    });

    $("#libListsBtns").find("div").on("click", function (e) {
        $("#libListsBtns").find("div").removeClass("libBtnActive");
        $(".libList").removeClass("libActive");
        let inText = $(e.target).attr('class');
        $(e.target).addClass("libBtnActive");
        switch (inText) {
            case "libBtn1":
                $("#libLatelyList").addClass("libActive");
                break;
            case "libBtn2":
                setMyList();
                $("#libMyList").addClass("libActive");
                break;
        }
    });

    $("body").on("click", function (e) {
        if ($(e.target).parent().hasClass("contextmenu")) {
            return;
        }
        if ($(".contextmenu").length >= 1) {

            $(".contextmenu").remove();
        }
    });

    $("#myListPopupCloseBtn").on("click", function (e) {
        $(".myListPopup").slideUp("fast");
    });

    $("#isloopBtn").on("click", function (e) {
        console.log("들어옴1");
        let text;
        let ifText = $(e.target).hasClass(text);


        if ($(e.target).hasClass("fa-retweet")) {
            //대기열 반복으로 바꾸기
            $("audio")[0].loop = false;
            g_Queue.changeQueueLoop();
            $(e.target).removeClass("fa-retweet");
            $(e.target).addClass("fa-sync-alt");
        } else if ($(e.target).hasClass("fa-sync-alt")) {
            //반복 X
            g_Queue.changeQueueLoop();
            $(e.target).removeClass("fa-sync-alt");
            $(e.target).addClass("fa-times");
        } else if ($(e.target).hasClass("fa-times")) {
            //음악반복으로 바꾸기
            $("audio")[0].loop = true;
            $(e.target).removeClass("fa-times");
            $(e.target).addClass("fa-retweet");
        }

    });

    let loading = setInterval(function (e) {
        if (g_Music.loaded && g_List.loaded) {
            $("#header-list").find("a").eq(0).click();
            clearInterval(loading);
        }
    }, 200);
};