

const menuMusic = document.getElementById('menu-music');
let playedTime = 0;

// Change the screens of the menu
function showScreen(screen_id) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });

    const selectedScreen = document.getElementById(screen_id);
    if (selectedScreen) {
        selectedScreen.style.display = 'flex';
    }


    if (screen_id === 'register') {
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm').value = '';
        document.getElementById('reg-fname').value = '';
        document.getElementById('reg-lname').value = '';
        document.getElementById('reg-email').value = '';
    }

    if (screen_id === 'login') {
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    }
}


// About Us dialog
function openAbout() {
    const dialog = document.getElementById("aboutDialog");
    dialog.showModal();
  }

  function closeAbout() {
    const dialog = document.getElementById("aboutDialog");
    dialog.close(); 
  }
  

let users_array = [{'b':'b'}, {'נ':'נ'}, {'p':'testuser'}]
// Check the Register
function registerUser(event){
    event.preventDefault();

    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if(password !== confirm){
      alert("Passwords dont match!")
      return;
    }

    const user = document.getElementById('reg-username').value;
    users_array.push({[user]: password});

    alert('Register Success!');

    showScreen('login');
  }

  // Check User Valid
  function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    let found = false;

    for (let i = 0; i < users_array.length; i++) {
        if (users_array[i][username] === password) {
            found = true;
            break;
        }
    }

    
    if (found) {
        alert('Login Success!');
        currentUser = username;
        highScores = [];
        showScreen('conf');
    } else {
        alert('Username or Password incorrect!');
    }
}

function setShootKey(event) {

    if (event.key === " ") { 
        event.preventDefault();
    }

    const shootInput = document.getElementById('shoot');

    shootInput.value = event.key;
    shoot = event.key;
}

function highlightSelected(selectedOption) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.style.border = "none";
    });
    selectedOption.style.border = "3px solid yellow";
}

function initConfiguration() {
    const shootInput = document.getElementById('shoot');
    const colorOptions = document.querySelectorAll('.color-option');

    shootInput.addEventListener('focus', function () {
        document.addEventListener('keydown', setShootKey);
    });

    shootInput.addEventListener('blur', function () {
        document.removeEventListener('keydown', setShootKey);
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            color = option.getAttribute('data-color');
            highlightSelected(option);
        });
    });
}

initConfiguration();

let shoot = " ";
let total_seconds = 2;
let color = "";
let GameOver = false;
let highScores = [];
let currentUser = null;



let heroBullets = [];
let enemyBullets = [];

const shootImage = new Image();
const heroImage = new Image();
const enemyShootImage = new Image();


let enemyImage = [];
let enemyStartX = 100;
let enemyStartY = 50;
let enemyInitialSpeedX = 2;
let enemyInitialSpeedY = 1;
let enemyDirX = enemyInitialSpeedX;
let enemyDirY = enemyInitialSpeedY;
let enemy_speed = 2;
let enemyChangeDirectionTimer = 0;
let enemySpeedIncreaseCounter = 0;


let score = 0;
let count_hero_shoot = 0;
let count_dead_enemy = 0;
let explosionSound_hero = new Audio('audio/explosion_hero.mp3');
let explosionSound_enemy = new Audio('audio/explosion_enemy.mp3');


let explosionX = -1000;
let explosionY = -1000;
let explosionVisible = false;
let explosionSize = 100;
const explosiveImage = new Image();
explosiveImage.src = 'images/explosive.png';


// Check User game Setting
function conf1(event) {
    event.preventDefault();

    shoot = document.getElementById('shoot').value;
    total_seconds = document.getElementById('gameTime').value * 60;

    if (shoot === "") {
        alert("You must select a shooting key!");
        return false;
    }

    if (color === "") {
        alert("You must select an Aircraft!");
        return false;
    }

    init_hero_AirCraft_Images(color);
    init_enemy_AirCraft_Images();

    heroImage.onload = () => {
        startGame();
    };
}

// Init the images to the hero AirCraft
function init_hero_AirCraft_Images(color){
    heroImage.src = `images/H_Aircrafts/hero_${color}_AirCraft.png`;
    shootImage.src = `images/Lasers/${color}_laser.png`;
}

// Init the images of the enemy AirCraft
function init_enemy_AirCraft_Images(){

    enemyShootImage.src = 'images/Lasers/red_laser.png';

    for (let i = 0; i < 4; i++){
        enemyImage[i] = [];
        for (let j = 0; j < 5 ; j++){
            enemyImage[i][j] = new Image();
            if(i === 0){
                enemyImage[i][j].src = "images/E_Aircrafts/enemy_purple_AirCraft.png"
            }
            else if(i === 1){
                enemyImage[i][j].src = "images/E_Aircrafts/enemy_red_AirCraft.png"
            }
            else if(i === 2){
                enemyImage[i][j].src = "images/E_Aircrafts/enemy_blue_AirCraft.png"
            }
            else{
                enemyImage[i][j].src = "images/E_Aircrafts/enemy_green_AirCraft.png"
            }
        }
    }
}


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


let bgY = 0;
let bgSpeed = 1; // background speed

let hero;
const keys = {};
let hero_Visible = true;
let lives = 3;

document.addEventListener("keydown", e => {keys[e.key] = true});
document.addEventListener("keyup", e => {keys[e.key] = false});

// Update the game every 16 ms
function update(){

    if(GameOver){
        return;
    }

    if(hero_Visible){
        if(keys["ArrowUp"] && hero.y > canvas.height * 0.6) hero.y -= hero.speed;
        if(keys["ArrowDown"] && hero.y < canvas.height - 100) hero.y += hero.speed;
        if(keys["ArrowLeft"] && hero.x > 0) hero.x -= hero.speed;
        if(keys["ArrowRight"] && hero.x < canvas.width - 100) hero.x += hero.speed;
    }
    

    // Mooving enemy
    enemyStartX += (enemyDirX * enemy_speed);
    enemyStartY += (enemyDirY * enemy_speed);

    enemyChangeDirectionTimer++;
    if (enemyChangeDirectionTimer > 120){  // changed every 2 secound
        enemyChangeDirectionTimer = 0;
        enemyDirX = Math.floor(Math.random() * 7) - 3;
        enemyDirY = Math.floor(Math.random() * 3); 
    }

    if (enemyStartX < 0) {
        enemyStartX = 0;
        enemyDirX *= -1;
    }
    if (enemyStartX + 5 * (canvas.width / 6) > canvas.width) {
        enemyStartX = canvas.width - 5 * (canvas.width / 6);
        enemyDirX *= -1;
    }
    if (enemyStartY < 0) {
        enemyStartY = 0;
        enemyDirY *= -1;
    }
    if (enemyStartY > canvas.height * 0.12){
        enemyStartY = canvas.height * 0.12;
        enemyDirY *= -1;
    }

    if(keys[shoot]) shootHeroBullet();

    for(let i=0; i<heroBullets.length; i++){
        heroBullets[i].y -= heroBullets[i].speed;
    }


    // Collision detection between hero_shoot to enemy
    let bulletsToRemove = [];

    for (let i = 0; i < heroBullets.length; i++) {
        const bullet = heroBullets[i];
        let hit = false;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                const enemy = enemyImage[row][col];

                if (enemy !== null) {
                    let enemyX = enemyStartX + col * (canvas.width / 6);
                    let enemyY = enemyStartY + row * (canvas.height / 8);

                    if (bullet.x < enemyX + 100 &&
                        bullet.x + bullet.width > enemyX &&
                        bullet.y < enemyY + 100 &&
                        bullet.y + bullet.height > enemyY) {

                        enemyImage[row][col] = null;
                        count_dead_enemy++;

                        playExplosionSound_Enemy();

                        bulletsToRemove.push(i);
                        score += ((5-row-1) * 5);

                        if(score === 250){
                            GameOver = true;
                            showGameOverScreen("Champion!");
                            return;
                        }

                        document.getElementById('scoreBoard').innerText = 'Score: ' + score;

                        hit = true;
                        break;
                    }
                }
            }
            if (hit) break;
        }
    }


    for (let i = bulletsToRemove.length - 1; i >= 0; i--) {
        heroBullets.splice(bulletsToRemove[i], 1);
    }

    

    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += enemyBullets[i].speed;
        enemyBullets[i].x += enemyBullets[i].dx || 0;
    }

    // Collision detection between enemy bullets and hero
    for (let i = 0; i < enemyBullets.length; i++) {
        const bullet = enemyBullets[i];

        if (hero_Visible && bullet.x < hero.x + 100 &&
            bullet.x + bullet.width > hero.x &&
            bullet.y < hero.y + 100 &&
            bullet.y + bullet.height > hero.y) {

            hero_Visible = false;  // Hide hero
            playExplosionSound_Hero();
            lives--;
            if(lives == 0){
                GameOver = true;
                showGameOverScreen("You Lost!");
                return;
            }
            document.getElementById('livesBoard').innerText = 'Lives: ' + lives;


            explosionX = hero.x;
            explosionY = hero.y;
            explosionSize = 100;
            explosionVisible = true;

            setTimeout(() => {
                // Disapere the explosion after 1 secound
                explosionVisible = false;
            }, 1000);

            setTimeout(() => {
                if(!GameOver){
                    // Return hero to start position after 3 secound
                    hero.x = canvas.width / 2 - 50;
                    hero.y = canvas.height * 0.8;
                    hero_Visible = true;
                }
            }, 3000);

            // Remove the bullet
            enemyBullets.splice(i, 1);
            i--;
        }
    }
    
    // check if need to shoot again
    if (enemyBullets.length === 0 || enemyBullets[enemyBullets.length - 1].y > canvas.height * 0.75) {
        shootEnemyBullet();
    }
    
    // remove bullets that passed the screen
    enemyBullets = enemyBullets.filter(bullet => bullet.y < canvas.height); 

}

// Audio for the Explosion Hero
function playExplosionSound_Hero() {
    explosionSound_hero.currentTime = 0;
    explosionSound_hero.play();
}

// Audio for the Explosion Hero
function playExplosionSound_Enemy() {
    explosionSound_enemy.currentTime = 0;
    explosionSound_enemy.play();
}


// Shoot the hero bullet and sound
const heroShootSound = new Audio("audio/hero_shoot.wav");
const enemyShootSound = new Audio("audio/enemy_shoot.wav");

// Addidng the Hero bullets to the Array
function shootHeroBullet(){

    if (!hero_Visible) return;

    let bulletWidth = canvas.width * 0.02;
    let bulletHeight = canvas.height * 0.06;

    if (heroBullets.length === 0 || heroBullets[heroBullets.length - 1].y < hero.y - canvas.height * 0.1) {
        count_hero_shoot++;
        heroShootSound.currentTime = 0;
        heroShootSound.play();

        heroBullets.push({
            x: hero.x + hero.width / 2 - bulletWidth / 2, // center of hero
            y: hero.y - bulletHeight / 2, // start a bit higher than the top
            width: bulletWidth,
            height: bulletHeight,
            speed: canvas.height * 0.01
        });
    }
    
}


/*
// Addidng the Enemy bullets to the Array
function shootEnemyBullet() {
    let shootingEnemies = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            if (enemyImage[row][col] !== null) {
                shootingEnemies.push({ row: row, col: col });
            }
        }
    }

    if (shootingEnemies.length > 0) {
        let randomEnemy = shootingEnemies[Math.floor(Math.random() * shootingEnemies.length)];
        let enemyX = enemyStartX + randomEnemy.col * (canvas.width / 6);
        let enemyY = enemyStartY + randomEnemy.row * (canvas.height / 8);
        
        enemyShootSound.currentTime = 0;
        enemyShootSound.play();

        let dx = (Math.random() - 0.5) * 4;

        enemyBullets.push({
            x: enemyX + 50 - 15,  // Center the bullet relative to enemy
            y: enemyY + 100,
            dx: dx,  // for diagnol shooting
            width: 50,  
            height: 60,     
            speed: 5      
        });
        
        
    }
}
*/



function shootEnemyBullet() {
    let shootingEnemies = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            if (enemyImage[row][col] !== null) {
                shootingEnemies.push({ row: row, col: col });
            }
        }
    }

    if (shootingEnemies.length > 0) {
        let randomEnemy = shootingEnemies[Math.floor(Math.random() * shootingEnemies.length)];
        let enemyX = enemyStartX + randomEnemy.col * (canvas.width / 6);
        let enemyY = enemyStartY + randomEnemy.row * (canvas.height / 8);

        enemyShootSound.currentTime = 0;
        enemyShootSound.play();

        let bulletWidth = canvas.width * 0.02;
        let bulletHeight = bulletWidth * (enemyShootImage.height / enemyShootImage.width);
        let dx = (Math.random() - 0.5) * 4;

        enemyBullets.push({
            x: enemyX + bulletWidth,
            y: enemyY + bulletHeight,
            dx: dx,
            width: bulletWidth,
            height: bulletHeight,
            speed: enemyBulletSpeed

        });
    }
}


let enemyBulletSpeed = canvas.height * 0.01;


// Incresing the enemy Speed
function increaseEnemySpeed(){
    if(enemySpeedIncreaseCounter < 4){
        enemy_speed *= 1.2;
        enemySpeedIncreaseCounter++;

        enemyBulletSpeed *= 1.2;
    }
}


// Loop of the game
function gameLoop() {
    if(!GameOver){
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawHero();
    drawEnemys()

    drawHeroBullets();
    drawEnemyBullets();

    if (explosionVisible) {
        explosionY -= 2;
        explosionSize += 2;
        ctx.drawImage(explosiveImage, explosionX, explosionY, explosionSize, explosionSize);
    }
    

}

// Draw the hero
function drawHero() {
    if(hero_Visible){
        let baseWidth = canvas.width * 0.045;
        let heroWidth = baseWidth * 1.3;
        let heroHeight = baseWidth * (heroImage.height / heroImage.width);

        hero.width = heroWidth;
        hero.height = heroHeight;

        ctx.drawImage(heroImage, hero.x, hero.y, heroWidth, heroHeight);

        //ctx.drawImage(heroImage, hero.x, hero.y, 100, 100);
    }
}
   

// Draw the enemys
function drawEnemys() {
    let enemySpacingX = canvas.width / 6;
    let enemySpacingY = canvas.height / 8;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            if (enemyImage[i][j] !== null && enemyImage[i][j].complete) {
                //ctx.drawImage(enemyImage[i][j], enemyStartX + j * enemySpacingX, enemyStartY + i * enemySpacingY, 100, 100);

                let baseWidth = canvas.width * 0.045;
                let enemyWidth = baseWidth * 1.3; 
                let enemyHeight = baseWidth * (enemyImage[i][j].height / enemyImage[i][j].width);

                ctx.drawImage(
                    enemyImage[i][j],
                    enemyStartX + j * enemySpacingX,
                    enemyStartY + i * enemySpacingY,
                    enemyWidth,
                    enemyHeight
                );


            }
        }
    }
}


// Timer function
function StartTimer(){
    const timer = setInterval(() => {
        if(GameOver){
            clearInterval(timer);
            return;
        }
        
        playedTime ++;
        total_seconds--;

        let minutes = Math.floor(total_seconds / 60);
        let seconds = total_seconds % 60;

        if (seconds < 10) seconds = "0" + seconds;
        if (minutes < 10) minutes = "0" + minutes;

        document.getElementById('timerBoard').innerText = `Time: ${minutes}:${seconds}`;

        if(total_seconds <= 0){
            clearInterval(timer);
            GameOver = true;
            showGameOverScreen("Winner!");
            return;
        }

    }, 1000);
}

/*
// Draw the hero bullets
function drawHeroBullets(){
    heroBullets.forEach(bullet => {
        ctx.drawImage(shootImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}
*/


function drawHeroBullets(){
    heroBullets.forEach(bullet => {
        let bulletWidth = canvas.width * 0.02;
        let bulletHeight = bulletWidth * (shootImage.height / shootImage.width);
        ctx.drawImage(shootImage, bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}




// Draw the enemy bullets
function drawEnemyBullets(){
    enemyBullets.forEach(bullet => {
        ctx.drawImage(enemyShootImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}



// Mooving the background to looks like mooving in space
const bgImage = new Image();
bgImage.src = "images/game_star.png";
function drawBackground() {
    bgY += bgSpeed;

    if (bgY >= canvas.height) {
        bgY = 0;
    }

    ctx.drawImage(bgImage, 0, bgY, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, bgY - canvas.height, canvas.width, canvas.height);
}

let enemySpeedInterval;
// Start the Game
function startGame() {
    const menuMusic = document.getElementById('menu-music');
    menuMusic.play();
    menuMusic.currentTime = 0;

    showScreen('game');
    window.scrollTo(0, 0);

    hero = {x : (canvas.width / 2) - 50, y : canvas.height * 0.8, width : 50, height : 50, speed : 10};

    // Every 5 Secound calls the function to increase enemy speed
    enemySpeedInterval = setInterval(increaseEnemySpeed, 3000);


    //gameLoop();
    //StartTimer();

    startCountdown();

}

// Block Arrow Keys Scroll only in Game Screen
document.addEventListener('keydown', function(event) {
    const isGameScreen = document.getElementById('game').style.display === 'flex';

    if (isGameScreen) {
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', shoot];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        }

        // Prevent default for arrows always
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        }

        // Prevent default for space only if it's not the shoot key
        if (event.key === ' ' && shoot !== ' ') {
            event.preventDefault();
        }
    }
});

// Gane Over Screen
function showGameOverScreen(message) {

    clearInterval(enemySpeedInterval);
    menuMusic.pause();

    if(total_seconds === 0 && score <= 100){
        message = "You can do better!";
    }

    let minutesPlayed = Math.floor(playedTime / 60);
    let secondsPlayed = playedTime % 60;
    if (secondsPlayed < 10) secondsPlayed = "0" + secondsPlayed;
    if (minutesPlayed < 10) minutesPlayed = "0" + minutesPlayed;

    let accuracy = 0;
    if (count_hero_shoot > 0) {
        accuracy = (count_dead_enemy / count_hero_shoot) * 100;
    }

    const messageElement = document.getElementById('gameOverMessage');
    messageElement.innerText = message;
    messageElement.className = '';

    if (message === "Champion!") {
        messageElement.classList.add('champion-message');
    } else if (message === "You Lost!") {
        messageElement.classList.add('lost-message');
    } else {
        messageElement.classList.add('better-message');
    }

    document.getElementById('finalScore').innerText = score;
    document.getElementById('accuracy').innerText = accuracy.toFixed(2) + ' %';
    document.getElementById('timePlayed').innerText = minutesPlayed + ':' + secondsPlayed;


    // Remove highlight from all previous scores
    highScores.forEach(entry => entry.isCurrent = false);

    // Save the current game result
    let current = {
        score: score,
        accuracy: accuracy.toFixed(2),
        time: playedTime,  // time in seconds (used for tiebreaker)
        timeDisplay: minutesPlayed + ":" + secondsPlayed,
        isCurrent: true
    };

    highScores.push(current);

    // Sort by score descending, then by shortest time
    highScores.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });

    // Assign rank to each entry
    highScores.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    // Keep only the top 5 scores
    highScores = highScores.slice(0, 5);

    // Render the high score table
    renderHighScores();




    showScreen('gameOverScreen');
}



function renderHighScores() {
    const table = document.getElementById('highScoreList');
    table.innerHTML = '';

    const headerRow = createScoreRow(['Rank', 'Score', 'Accuracy', 'Time'], true);
    table.appendChild(headerRow);

    highScores.forEach(entry => {
        const row = createScoreRow([
            entry.rank,
            entry.score,
            entry.accuracy + ' %',
            entry.timeDisplay
        ], false, entry.isCurrent);
        table.appendChild(row);
    });
}

function createScoreRow(data, isHeader = false, highlight = false) {
    const row = document.createElement('tr');
    data.forEach(cellText => {
        const cell = document.createElement(isHeader ? 'th' : 'td');
        cell.innerText = cellText;
        row.appendChild(cell);
    });

    if (highlight) {
        row.classList.add('highlight-current-score');
    }

    return row;
}




// Reastart the game and go back to the same user
function restartGame(){
    resetGame();
    resetConfigurationScreen();
    showScreen('conf');
}

// Reastart the game and go back to the Home screen
function restartGame_andHome(){
    resetGame();
    resetConfigurationScreen();
    showScreen('welcome');
}


// Restart the game
function resetGame(){
    // Reset game variables
    GameOver = false;
    score = 0;
    lives = 3;
    count_hero_shoot = 0;
    count_dead_enemy = 0;
    playedTime = 0;
    heroBullets = [];
    enemyBullets = [];
    enemySpeedIncreaseCounter = 0;
    enemyBulletSpeed = canvas.height * 0.01;
    enemy_speed = 2;
    enemyStartX = 100;
    enemyStartY = 50;
    hero.x = (canvas.width / 2) - 50;
    hero.y = canvas.height * 0.8;
    hero_Visible = true;

    document.getElementById('scoreBoard').innerText = 'Score: 0';
    document.getElementById('livesBoard').innerText = 'Lives: 3';
    document.getElementById('timerBoard').innerText = 'Time: 00:00';
}

// Screen before the game start
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    let count = 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    countdownElement.style.display = 'block';
    countdownElement.innerText = count;

    let countdownInterval = setInterval(() => {
        count--;
        if (count === 0) {
            countdownElement.innerText = 'Protect the Universe!';
        } else {
            countdownElement.innerText = count;
        }

        if (count < 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = 'none';

            gameLoop();
            StartTimer();
        }
    }, 1000);
}

// If start a new game it will reset the old Settings
function resetConfigurationScreen(){
    document.getElementById('shoot').value = '';
    document.getElementById('gameTime').value = 2;

    shoot = ' ';
    color = '';

    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.style.border = "none";
    });
}