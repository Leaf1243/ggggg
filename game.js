const canvas = document.getElementById('gameCanvas');  
const ctx = canvas.getContext('2d');  

let player = {  
    x: canvas.width / 2,  
    y: canvas.height - 30,  
    width: 50,  
    height: 50,  
};  

let lasers = [];  
let enemies = [];  
let score = 0;  

// 敵の生成  
function createEnemy() {  
    const enemy = {  
        x: Math.random() * (canvas.width - 50),  
        y: 0,  
        width: 50,  
        height: 50,  
        speed: 2,  
    };  
    enemies.push(enemy);  
}  

// レーザーの発射  
function shootLaser() {  
    const laser = {  
        x: player.x + player.width / 2 - 2.5,  
        y: player.y,  
        width: 5,  
        height: 20,  
        speed: 5,  
    };  
    lasers.push(laser);  
}  

// レーザーと敵の衝突判定  
function checkCollision() {  
    for (let i = lasers.length - 1; i >= 0; i--) {  
        for (let j = enemies.length - 1; j >= 0; j--) {  
            if (  
                lasers[i].x < enemies[j].x + enemies[j].width &&  
                lasers[i].x + lasers[i].width > enemies[j].x &&  
                lasers[i].y < enemies[j].y + enemies[j].height &&  
                lasers[i].y + lasers[i].height > enemies[j].y  
            ) {  
                lasers.splice(i, 1);  
                enemies.splice(j, 1);  
                score++;  
                break;  
            }  
        }  
    }  
}  

// ゲームの更新  
function update() {  
    lasers.forEach(laser => {  
        laser.y -= laser.speed;  
    });  

    enemies.forEach(enemy => {  
        enemy.y += enemy.speed;  
    });  

    // レーザーが画面外に出たら削除  
    lasers = lasers.filter(laser => laser.y > 0);  
    enemies = enemies.filter(enemy => enemy.y < canvas.height);  
    
    checkCollision();  
}  

// 描画  
function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    
    // プレイヤー  
    ctx.fillStyle = 'blue';  
    ctx.fillRect(player.x, player.y, player.width, player.height);  
    
    // レーザー  
    ctx.fillStyle = 'red';  
    lasers.forEach(laser => {  
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);  
    });  

    // 敵  
    ctx.fillStyle = 'green';  
    enemies.forEach(enemy => {  
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);  
    });  

    // スコア表示  
    ctx.fillStyle = 'black';  
    ctx.font = '20px Arial';  
    ctx.fillText(`スコア: ${score}`, 10, 20);  
}  

// ゲームループ  
function gameLoop() {  
    update();  
    draw();  
    requestAnimationFrame(gameLoop);  
}  

// イベントリスナー  
document.addEventListener('keydown', (event) => {  
    if (event.code === 'Space') {  
        shootLaser();  
    }  
});  

// 敵の生成を定期的に行う  
setInterval(createEnemy, 1000);  

// ゲームスタート  
gameLoop();  
