const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const audio= $('#audio') 
const progress = $('#progress');
let playing = false; 
const loader = $('.loader'); 
const bgContainer = $('.container')
const bgMain = $('.main-bg')

const curSong = $('.cur-playing') 


const playPause = $('.play-pause');
const btnPlay = $('.btn-play')
const btnPause = $('.btn-pause')
const btnNext = $('.next')
const btnPrev = $('.prev')
const repeat = $('.repeat')
let isRepeat 
const shuffle = $('.shuffle') 
let isShuffle

const list = $('.column') 


const theme = $('.theme-icon') 
let ramdomMemory = [];
var listSong ; 
var currentSong =0; 

const hostLink = 'https://raw.githubusercontent.com/NVB07/m3-data/main/acssets/mp3/'
const apiMusic = 'https://raw.githubusercontent.com/NVB07/m3-data/main/package.json';

function start(){
    getApi((data)=>{
        const arrayData = data.mp3;
        mainApp.start(arrayData)
        handleTimes.onTimeStart()
    })
}
start();

function getApi(data) {
    fetch(apiMusic)
        .then(response => response.json())
        .then(data)
        .catch(error => console.error(error));
}


const mainApp = {
    renderPlaylist : function(arraySong){
        const htmlsList = arraySong.map((song,index)=>{
            return `
                    <div class="song">
                        <img src="${song.image}" alt="" class="img-song-item">
                        <div class="decript">
                            <div class="name-song-item">${song.name}</div>
                            <div class="singer-song-item">${song.singer}</div>
                        </div>
                        
                    </div>
                    `
        })
        list.innerHTML = htmlsList.join('')
    
     
        listSong = $$('.song')
    },
    
    renderCurrentSong: function(items){
        audio.src = hostLink + items[currentSong].src;
        bgContainer.style.backgroundImage =`url(${items[currentSong].image}) `
        bgMain.style.backgroundImage = `url(${items[currentSong].image}) `
        curSong.innerHTML = 
            `
            <div class="cur-song">
                <div class="now">Now playing :</div>
                <div class="name-song">${items[currentSong].name}</div>
                <div class="name-singer">${items[currentSong].singer}</div>
            </div>
            <div class="cur-img">
                <img src="${items[currentSong].image}" alt="" class="img">
                <img src="${items[currentSong].image}" alt="" class="drop-img">
            </div>
            `

      
        
        listSong[currentSong].classList.add('now-play')
    },
    handleEvents: function(array){
        theme.onclick =()=>{
            $('.main-bg-filter').classList.toggle('change-theme')
        }
        
        repeat.onclick = ()=>{
            isRepeat= repeat.classList.toggle('focus')
        }
        
        shuffle.onclick = ()=>{
            isShuffle= shuffle.classList.toggle('focus')
        }
        playPause.onclick = ()=>{
            if(!playing){
                generalFunction.audioPlay();
            }
            else{
                generalFunction.audioPause()
            }
        }
        
        btnNext.onclick=()=>{
            generalFunction.audioNext(array)
        }
        btnPrev.onclick=()=>{
            generalFunction.audioBack(array)
        }
        audio.onended =()=>{
            if(isRepeat){
                generalFunction.audioPlay()
            }
            else{
                generalFunction.audioNext(array)
            }
        }
    
        for(let j = 0 ; j< listSong.length; j++){
            listSong[j].onclick=()=>{
                currentSong = j;
                generalFunction.removeClass()
                this.renderCurrentSong(array)
                generalFunction.audioPlay()
            }
        }
    },

    start : function(array){
        this.renderPlaylist(array)
        this.renderCurrentSong(array)
        this.handleEvents(array)
    }
}


const generalFunction= {
    removeClass :function(){
        var activeElements = $$(".now-play");
        for (var i = 0; i < activeElements.length; i++) {
            activeElements[i].classList.remove("now-play");
        }
    },
    audioPlay: function(){
        audio.play();
        playing= true;
        btnPlay.classList.add('dp-none')
        btnPause.classList.remove('dp-none')
    },
    
    audioPause :function(){
        audio.pause();
        playing= false;
        btnPause.classList.add('dp-none')
        btnPlay.classList.remove('dp-none')
    },
    audioNext: function(array){
        if(isShuffle){
          currentSong =  this.isShuffled(array.length, ramdomMemory)
        }
        else{
            currentSong++;
            if( currentSong >= array.length ){
                currentSong = 0;
            }
        }
        this.removeClass() 
        mainApp.renderCurrentSong(array)
        this.audioPlay()
    },
    
    audioBack :function(array){
        if(isShuffle){
            currentSong =  this.isShuffled(array.length, ramdomMemory)
          }
        else{
            currentSong--;
            if( currentSong < 0 ){
                currentSong = array.length -1 ;
            }
        }
        
        this.removeClass()
        mainApp.renderCurrentSong(array);
        this.audioPlay()
    },
    isShuffled: function(arrLength, arr) {
        let randomNumber = Math.floor(Math.random() * arrLength);
        while (arr.includes(randomNumber)) {
          randomNumber = Math.floor(Math.random() * arrLength);
        }
        arr.push(randomNumber);
        return randomNumber;
    },
}


const handleTimes={
    updateTrack: function(){
        audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercent = Math.floor(
                (audio.currentTime / audio.duration) * 100
              );
              progress.value = progressPercent ;
              if(progress.value <45){
                loader.style.width = progress.value-1.5 +2 +"%";
                }
                else{
                    loader.style.width = progress.value - 0.5 +"%";
                }
            }
          }
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
    },
    updateTime:function(){
            var time = audio.currentTime;
            var timeSecons = Math.floor(time / 1);
            var min = Math.floor(timeSecons / 60);
            (min >= 1) ? timeSecons = timeSecons - (min*60) : min = '0';
            (timeSecons < 1) ? sec='0' : void 0;
            if(min < 10) {
                min = "0" + min;
            }
            if(timeSecons < 10) {
                timeSecons = "0" + timeSecons;
            }
            $(".curTime").innerHTML = min + ":" + timeSecons;
    }, 
    getDurationTimes:function(){
        audio.onloadedmetadata = function() {
            var time = audio.duration;
          
          
            var timeSecons = Math.floor(time / 1);
            
              var min = Math.floor(timeSecons / 60);
              (min >= 1) ? timeSecons = timeSecons - (min*60) : min = '0';
              (timeSecons < 1) ? sec='0' : void 0;
              if(min < 10) {
                min = "0" + min;
            }
              if(timeSecons < 10) {
                timeSecons = "0" + timeSecons;
            }
            $(".sumTime").innerHTML = min + ":" + timeSecons;
          };
    },
    onTimeStart:function(){
        this.updateTrack();
        setInterval('handleTimes.updateTime()', 1000);
        this.getDurationTimes()
    }
}

