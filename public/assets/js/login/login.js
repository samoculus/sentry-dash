document.getElementById('login-btn').disabled = true;

let email = document.getElementById('email');

email.addEventListener('input', () => {
    if (email.value.length > 0) {
        document.getElementById('login-btn').disabled = false;
    } else { 
        document.getElementById('login-btn').disabled = true;
    };
   
});
