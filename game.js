const canvas = document.getElementById('gameCanvas');  
const ctx = canvas.getContext('2d');  

let player = {  
    x: canvas.width / 2 - 25, // プレイヤーをキャンバスの中央に配置  
    y: canvas.height - 50, // プレイヤーの高さを考慮  
    width: 50,  
    height: 50,  
    speed: 10 // プレイヤーの速度  
};  

let lasers = [];  
let enemies = [];  
let score = 0;  
let gameOver = false; // ゲームオーバーの状態を管理  

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
function checkLaserCollision() {  
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

// プレイヤーと敵の衝突判定  
function checkPlayerCollision() {  
    for (let enemy of enemies) {  
        if (  
            player.x < enemy.x + enemy.width &&  
            player.x + player.width > enemy.x &&  
            player.y < enemy.y + enemy.height &&  
            player.y + player.height > enemy.y  
        ) {  
            gameOver = true; // 衝突が検出されたらゲームオーバー  
            break;  
        }  
    }  
}  

// ゲームの更新  
function update() {  
    if (gameOver) return; // ゲームオーバーの場合は更新しない  

    lasers.forEach(laser => {  
        laser.y -= laser.speed;  
    });  

    enemies.forEach(enemy => {  
        enemy.y += enemy.speed;  
    });  

    // レーザーが画面外に出たら削除  
    lasers = lasers.filter(laser => laser.y > 0);  
    enemies = enemies.filter(enemy => enemy.y < canvas.height);  
    
    checkLaserCollision();  
    checkPlayerCollision(); // プレイヤーの衝突チェック  
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

    // ゲームオーバー表示  
    if (gameOver) {  
        ctx.fillStyle = 'red';  
        ctx.font = '40px Arial';  
        ctx.fillText('ゲームオーバー', canvas.width / 2 - 100, canvas.height / 2);  
    }  
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
    if (gameOver) return; // ゲームオーバーの場合は操作を無視  

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {  
        player.x -= player.speed; // 左移動  
        if (player.x < 0) player.x = 0; // 画面外に出ないように  
    }  
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {  
        player.x += player.speed; // 右移動  
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width; // 画面外に出ないように  
    }  
    if (event.code === 'ArrowUp' || event.code === 'KeyW') {  
        player.y -= player.speed; // 上移動  
        if (player.y < 0) player.y = 0; // 画面外に出ないように  
    }  
    if (event.code === 'ArrowDown' || event.code === 'KeyS') {  
        player.y += player.speed; // 下移動  
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height; // 画面外に出ないように  
    }  
});  

// 敵の生成を定期的に行う  
setInterval(createEnemy, 1000);  

// ゲームスタート  
gameLoop();
