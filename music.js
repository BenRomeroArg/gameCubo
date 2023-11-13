let music = new Audio();
music.src = 'recursos/music.mp3';
const playGame = document.getElementById('game');
const text = document.getElementById('textMusic');
music.volume = 0.5;
music.loop = true;

playGame.addEventListener('click',(e)=>{
    if(playGame.style.display === 'block'){
        music.play();  
        text.innerText = '-Music -Afrojack- Take over Control-';
    }else {
        music.pause();
    }
    e.preventDefault();
    playGame.removeEventListener('click', this);
})