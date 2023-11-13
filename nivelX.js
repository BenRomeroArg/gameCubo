const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let bestScore = localStorage.getItem("bestScore") || 0;
let lives = 3;
let kill = [];
const game_over = document.getElementById('gameOver');
game_over.addEventListener('click',()=>{
    window.location.reload();

});
// Avión
const plane = {    
    x: canvas.width / 2,
    y: 510,
    width: 30,
    height: 30,
    color: "#c4c9c9ef",
    speed: 1
};
// Disparos
const bullets = [];
const bulletSpeed = 7;
// Enemigos
const enemies = [];
const enemySpeed = 2.15;

function crearEnemies(){
    return{
        x: Math.random()* canvas.width,
        y: 0,
        color: 'grey',
        width: 27,
        height: 18
    }
}
//

// Función para dibujar el avión
function drawPlane() {
    ctx.beginPath();
    ctx.rect(plane.x, plane.y, plane.width, plane.height);
    ctx.fillStyle = plane.color;
    ctx.fill();
    ctx.closePath();
}
// Función para dibujar disparos
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.closePath();
    });
}
// Función para dibujar enemigos
function drawEnemies() {
    enemies.forEach(enemy => {
        if(enemy.color !== "blue"){
            ctx.beginPath();
            ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
       
            ctx.fillStyle = enemy.color;
            ctx.fill();
            ctx.closePath();
        }
    });
   
}
//
function killsEnemies() {
    
        
            ctx.beginPath();
            ctx.rect(kill.x, kill.y, kill.width, kill.height);
       
            ctx.fillStyle = kill.color;
            ctx.fill();
            ctx.closePath();
       
  
   
}
// Escuchar eventos de teclado para controlar el avión
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && plane.x > 0) {
        plane.x -= (plane.speed*3);
       
    } else if (event.key === "ArrowRight" && plane.x < canvas.width - plane.width) {
        plane.x += (plane.speed*3);
        
    } else if (event.key === " ") {
       shoot();
    }
});
//Control de movimientos
function moveUp() {  
    if (plane.x > 0) {
        plane.x -= (plane.speed*15);
    }
}
function moveDown() { 
    if (plane.x < canvas.width - plane.width) {
        plane.x += (plane.speed*15);
    }
}
document.addEventListener('click',shoot);
function shoot() {
    // Barra espaciadora para disparar
    const bullet = {
        x: plane.x + plane.width / 2,
        y: plane.y + plane.height / 2 - 10,
        width: 5,
        height: 5
    };
    bullets.push(bullet);
}
let score = 0;

// Función para verificar la colisión del avión con las paredes
function checkWallCollision() {
    if (plane.x < 1 || (plane.x+5) > canvas.width - plane.width) {
        // Colisión con la parte superior o inferior del lienzo       
        lives--;
        window.navigator.vibrate([500]);
        resetGame();
        if(lives === 0){
            
            document.getElementById('game').style.display = 'none';
            game_over.style.display = 'block';
            document.body.style.background = "black";
        }
       
    }
}
// Función para verificar la colisión del avión con los enemigos
function checkEnemyCollision() {
    enemies.forEach(enemy => {
        if (
            plane.x < enemy.x + enemy.width &&
            plane.x + plane.width > enemy.x &&
            plane.y < enemy.y + enemy.height &&
            plane.y + plane.height > enemy.y
        ) {
            // Colisión con un enemigo, reiniciar el juego
           
            lives--;
            window.navigator.vibrate([500]);
            console.log(lives);
            resetGame();
            if(lives === 0){
                //window.location.reload();
                document.getElementById('game').style.display = 'none';
                game_over.style.display = 'block';
                document.body.style.background = "black";
            }
        }
    });
}
// Función para reiniciar el juego
function resetGame() {
    
    score = score + 0;
    plane.x = canvas.width/2;
    plane.y = 510;
    bullets.length = 0;
    enemies.length = 0;
    
}
// Función principal de dibujo
function draw() {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar el avión
    drawPlane();
    // Dibujar y mover disparos
    drawBullets();
    bullets.forEach(bullet => {
        bullet.y -= bulletSpeed;
    });
    // Generar enemigos aleatorios
    if (Math.random() < 0.03) {
        const enemy = crearEnemies();
        enemies.push(enemy);
    }
    // Dibujar y mover enemigos
    drawEnemies();
    killsEnemies();
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;
        enemy.x += enemySpeed; 
        setTimeout(()=>{
            enemy.width += 0.23;
            enemy.x -= enemySpeed;       
        },1750);
        
    });
    
    // Colisiones entre disparos y enemigos
    bullets.forEach(bullet => {
        enemies.forEach(enemy => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Colisión detectada, eliminar el disparo y el enemigo
                bullets.splice(bullets.indexOf(bullet), 1);
                //enemies.splice(enemies.indexOf(enemy), 1);
                // Incrementar puntos por impacto
                enemy.y = Math.random() * (canvas.height / 2);
                enemy.x  =  Math.random() * canvas.width;
                enemy.width = 20;
               enemy.height = 10;
               window.navigator.vibrate([100]); 
                score += 10;
                kill.push(enemy);
               
            }
        });
        kill.forEach(k =>{     
            k.color = "red";
            k.x -= 0.07;
            k.y += 0.08;  
            if(bullet.x < kill.x + kill.width &&
                bullet.x + bullet.width > kill.x &&
                bullet.y < kill.y + kill.height &&
                bullet.y + bullet.height > kill.y){
                    window.navigator.vibrate([200]);
                    score+=15;
                }
            //kill.splice(kill.indexOf(k),1);
        });

    });   
    //enemies = enemies.filter(enemy => enemy.color !== 'red');
    // Verificar colisión del avión con las paredes
    checkWallCollision();
    // Verificar colisión del avión con los enemigos
    checkEnemyCollision();
    // Dibujar el marcador de puntos y vidas
    drawLives();
    drawScore();
    killScore()
    //Mejor puntuacion
    drawBestScore();
    // Solicitar el próximo cuadro de animación
    requestAnimationFrame(draw);
}
// Iniciar el juego
function start(){   
    document.getElementById('home').style.display= 'none';
    document.getElementById('startGame').style.display= 'none';
    document.getElementById('game').style.display = 'block';
    resetGame();
    draw();
}

//Mejor puntuacion
function saveBestScore(){
    if(score > bestScore){
        bestScore = score;
        localStorage.setItem("bestScore",bestScore);
    }
}
function drawBestScore(){
    saveBestScore();
    ctx.font = "18px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("BestScore: "+bestScore,canvas.width -160, 30);
}
function killScore(){
   let killN = kill.length; 
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Kills: "+killN,canvas.width -350, 30);

    
    
}
// Función para dibujar el marcador de puntos
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 30);
}
function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Lives: " + lives,canvas.width - 260, 30);
}



