const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let bestScore = localStorage.getItem("bestScore") || 0;
// Avión
const plane = {    
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    color: "#0095DD",
    speed: 1
};
// Disparos
const bullets = [];
const bulletSpeed = 7;
// Enemigos
const enemies = [];
const enemySpeed = 3;
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
        ctx.fillStyle = "#FF0022";
        ctx.fill();
        ctx.closePath();
    });
}
// Función para dibujar enemigos
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
       
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.closePath();
    });
}
// Escuchar eventos de teclado para controlar el avión
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && plane.y > 0) {
        plane.y -= plane.speed;
    } else if (event.key === "ArrowDown" && plane.y < canvas.height - plane.height) {
        plane.y += plane.speed;
    } else if (event.key === " ") {
        // Barra espaciadora para disparar
        const bullet = {
            x: plane.x + plane.width,
            y: plane.y + plane.height / 2 - 5,
            width: 10,
            height: 5
        };
        bullets.push(bullet);
    }
});
//Control de movimientos
function moveUp() {  
    if (plane.y > 0) {
        plane.y -= (plane.speed*15);
    }
}
function moveDown() { 
    if (plane.y < canvas.height - plane.height) {
        plane.y += (plane.speed*15);
    }
}
function shoot() {
    // Barra espaciadora para disparar
    const bullet = {
        x: plane.x + plane.width,
        y: plane.y + plane.height / 2 - 5,
        width: 10,
        height: 5
    };
    bullets.push(bullet);
}
let score = 0;
// Función para dibujar el marcador de puntos
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 30);
}
// Función para verificar la colisión del avión con las paredes
function checkWallCollision() {
    if (plane.y < 0 || plane.y > canvas.height - plane.height) {
        // Colisión con la parte superior o inferior del lienzo
        // Puedes personalizar esta lógica según tus necesidades
        resetGame();
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
            resetGame();
        }
    });
}
// Función para reiniciar el juego
function resetGame() {
    // Puedes agregar más lógica de reinicio si es necesario
    //alert("¡Juego terminado! Puntuación: " + score);
    score = 0;
    plane.x = 50;
    plane.y = canvas.height / 2;
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
        bullet.x += bulletSpeed;
    });
    // Generar enemigos aleatorios
    if (Math.random() < 0.02) {
        const enemy = {
            x: canvas.width,
            y: Math.random() * canvas.height,
            width: 30,
            height: 30
        };
        enemies.push(enemy);
    }
    // Dibujar y mover enemigos
    drawEnemies();
    enemies.forEach(enemy => {
        enemy.x -= enemySpeed;
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
                enemies.splice(enemies.indexOf(enemy), 1);
                // Incrementar puntos por impacto
                score += 10;
            }
        });
    });
    // Verificar colisión del avión con las paredes
    checkWallCollision();
    // Verificar colisión del avión con los enemigos
    checkEnemyCollision();
    // Dibujar el marcador de puntos
    drawScore();
    //Mejor puntuacion
    drawBestScore();
    // Solicitar el próximo cuadro de animación
    requestAnimationFrame(draw);
}
// Iniciar el juego
function start(){
   
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
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("BESTSCORE: "+bestScore,canvas.width -200, 30);
}



