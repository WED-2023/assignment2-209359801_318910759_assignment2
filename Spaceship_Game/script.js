
// Change the screens of the menu

function showScreen(screen_id){
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });

    const selectedScreen = document.getElementById(screen_id);
    if (selectedScreen) {
        selectedScreen.style.display = 'flex';
    }

    // Clear register fields
    if (screen_id === 'register') {
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm').value = '';
        document.getElementById('reg-fname').value = '';
        document.getElementById('reg-lname').value = '';
        document.getElementById('reg-email').value = '';
    }

    // Clear login fields
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

function about(evet){
    
    const dialog = document.getElementById("aboutDialog");
    const openBtn = document.getElementById("openAbout");
    const closeBtn = document.getElementById("closeBtn");

    
    openBtn.addEventListener("click", () => {
      dialog.showModal();
    });

    
    closeBtn.addEventListener("click", () => {
      dialog.close();
    });

    
    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        dialog.close();
      }
    });

    
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && dialog.open) {
        dialog.close();
      }
    });
}
