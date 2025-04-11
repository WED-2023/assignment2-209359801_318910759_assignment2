
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

    const menuMusic = document.getElementById('menu-music');
    menuMusic.volume = 0.3;
    if (menuMusic.paused) {
        menuMusic.play();
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


let users_array = [{'b':'b'}, {'נ':'נ'}]
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
        // Need to change to the play screen
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
let game_time = 2;
let color = "";
let GameOver = false;

let heroBullets = [];

const shootImage = new Image();
const heroImage = new Image();
const enemyShootingImage = new Image();


let enemyImage = [];
let enemyStartX = 100;
let enemyStartY = 50;
let enemyDirX = 2;
let enemyDirY = 1;
let enemyChangeDirectionTimer = 0;

let score = 0;


// Check User game Setting
function conf1(event) {
    event.preventDefault();

    shoot = document.getElementById('shoot').value;
    game_time = document.getElementById('gameTime').value;

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

    startGame();
}

// Init the images to the hero AirCraft
function init_hero_AirCraft_Images(color){
    heroImage.src = `images/H_Aircrafts/hero_${color}_AirCraft.png`;
    shootImage.src = `images/Lasers/${color}_laser.png`;
}

// Init the images of the enemy AirCraft
function init_enemy_AirCraft_Images(){

    enemyShootingImage.src = 'images/Lasers/red.laser.png';

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

const hero = {x : canvas.width / 2 - heroImage.width / 2 - 50, y : canvas.height * 0.8, width : 50, height : 50, speed : 7.5};
const keys = {};

document.addEventListener("keydown", e => {keys[e.key] = true});
document.addEventListener("keyup", e => {keys[e.key] = false});

// Update the game every 16 ms
function update(){

    if(keys["ArrowUp"] && hero.y > canvas.height * 0.6) hero.y -= hero.speed;
    if(keys["ArrowDown"] && hero.y < canvas.height - 100) hero.y += hero.speed;
    if(keys["ArrowLeft"] && hero.x > 0) hero.x -= hero.speed;
    if(keys["ArrowRight"] && hero.x < canvas.width - 100) hero.x += hero.speed;
    

    // Mooving enemy
    enemyStartX += enemyDirX;
    enemyStartY += enemyDirY;

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
    for (let i = 0; i < heroBullets.length; i++) {
        const bullet = heroBullets[i];
    
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
    
                        // Remove the enemy
                        enemyImage[row][col] = null;
    
                        // Remove the bullet
                        heroBullets.splice(i, 1);
                        i--;
                        score += ((5-row-1) * 5)
                        document.getElementById('scoreBoard').innerText = 'Score: ' + score;
                        break;
                    }
                }
            }
        }
    }
    

    // TODO: add collision detection between enemy_shoot to hero
    
    // TODO: limit hero movment into 40% of the canvas
}


// Shoot the hero bullet and sound
const heroShootSound = new Audio("audio/hero_shoot.wav");

function shootHeroBullet(){
    if(heroBullets.length === 0 || heroBullets[heroBullets.length-1].y < hero.y - 100) { 
        heroShootSound.currentTime = 0;
        heroShootSound.play();
        heroBullets.push({x: hero.x + 50 - 25, y: hero.y, width: 50, height: 60, speed: 13});
    }
}


// Loop of the game
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawHero();
    drawEnemys()

    drawHeroBullets();

}

// Draw the hero
function drawHero() {
    ctx.drawImage(heroImage, hero.x, hero.y, 100, 100);
}

// Draw the enemys
function drawEnemys() {
    let enemySpacingX = canvas.width / 6;
    let enemySpacingY = canvas.height / 8;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            if (enemyImage[i][j] !== null && enemyImage[i][j].complete) {
                ctx.drawImage(enemyImage[i][j], enemyStartX + j * enemySpacingX, enemyStartY + i * enemySpacingY, 100, 100);
            }
        }
    }
}

function StartTimer(){
    const timer = setInterval(() => {
        game_time--;
        if(game_time <= 0)
            clearInterval(timer);
            GameOver = true;
    }, 1000);
}

// Draw the hero bullets
function drawHeroBullets(){
    heroBullets.forEach(bullet => {
        ctx.drawImage(shootImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}


// Mooving the background
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


// Start the Game
function startGame() {
    const menuMusic = document.getElementById('menu-music');
    menuMusic.pause();
    menuMusic.currentTime = 0;

    showScreen('game');
    window.scrollTo(0, 0);

    gameLoop();
    StartTimer();
}

// Block Arrow Keys Scroll only in Game Screen
document.addEventListener('keydown', function(event) {
    const isGameScreen = document.getElementById('game').style.display === 'flex';

    if (isGameScreen) {
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', shoot];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        }
    }
});