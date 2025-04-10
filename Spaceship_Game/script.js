
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


let users_array = [{'p':'p'}]
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


let shoot = " ";
let game_time = 2;
let color = "";

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

    startGame();
}

function setShootKey(event) {
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
