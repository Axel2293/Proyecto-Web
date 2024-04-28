document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const host = 'http://localhost:3151';

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const isValid = checkInputs(); // Checks all inputs and sets form validity
        if (isValid) {
            showModal(isEmail(email.value), isPassword(password.value)); // Call showModal with validation results
        } else {
            showModal(isEmail(email.value), isPassword(password.value)); // Call showModal with validation results
        }
    });

    email.addEventListener('input', () => {
        validateField(email, isEmail(email.value.trim()), 'Email is not valid');
    });

    password.addEventListener('input', () => {
        // const passValue = password.value.trim();
        validateField(password, password.value.trim().length >= 8, 'Password must be at least 8 characters long');
        // validateField(password, isPassword(passValue), 'Password must be at least 8 characters long');
    });

    function checkInputs() {
        const isEmailValid = isEmail(email.value.trim());
        const passValue = password.value.trim();
        const isPasswordValid = passValue.length >= 8; // && isPassword(passValue);

        validateField(email, isEmailValid, 'Email is not valid');
        validateField(password, isPasswordValid, 'Password must be at least 8 characters long');

        return isEmailValid && isPasswordValid;
    }

    function validateField(input, condition, errorMessage) {
        if (condition) {
            setSuccess(input);
        } else {
            setError(input, errorMessage);
        }
    }

    function setError(input, message) {
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.className = 'form-control error';
        icon.className = 'icon fas fa-times-circle';
        input.placeholder = message;
    }

    function setSuccess(input) {
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.className = 'form-control success';
        icon.className = 'icon fas fa-check-circle';
    }

    function isEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    }

    function isPassword(password) {
        return password.length >= 8; // && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    }

    async function showModal(isEmailValid, isPasswordValid) {
        if (!isEmailValid || !isPasswordValid) {
            Swal.fire({
                icon: 'error',
                title: 'Form Error',
                text: 'Verify your ' + (!isEmailValid ? 'email ' : '') + (!isEmailValid && !isPasswordValid ? 'and ' : '') + (!isPasswordValid ? 'password' : ''),
                footer: '<p><a href="#">Need help?</a></p>',
            });
        } else {
            await login();
        }
    }

    //LOGIN FUNCTION
    async function login(){
        const userCred = {
            "email": email.value,
            "password": password.value
        }
        console.log(JSON.stringify(userCred))
        //Send request to get token if valid
        const res = await fetch(host+"/auth/login", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userCred)
        }).then( async res=>{
            const body = await res.json();
            if(res.ok){
                console.log(body["sToken"]);
                sessionStorage.setItem("sToken", body["sToken"]);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful! Welcome aboard!',
                    text: 'Redirecting to dashboard...',
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = host+'/dashboard';
                }, 1500);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: body["authError"],
                    text: 'Login failed',
                    showConfirmButton: true
                });
            }
        }).catch(err=>{
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong: '+err,
                text: 'Internal error :p',
                showConfirmButton: true
            });
        })
    }
});

