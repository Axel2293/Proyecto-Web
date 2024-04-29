document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainForm');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const host = 'http://localhost:3151';

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const isValid = checkInputs(); // Checks all inputs and sets form validity
        if (isValid) {
            showModal(isValid, isEmail(email.value), isPassword(password.value)); // Call showModal with validation results
        } else {
            showModal(isValid, isEmail(email.value), isPassword(password.value)); // Call showModal with validation results
        }
    });

    name.addEventListener('input', () => {
        validateField(name, name.value.trim() !== '', 'Name cannot be blank');
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
        const isNameValid = name.value.trim() !== '';
        const isEmailValid = isEmail(email.value.trim());
        const passValue = password.value.trim();
        const isPasswordValid = passValue.length >= 8; // && isPassword(passValue);

        validateField(name, isNameValid, 'Name cannot be blank');
        validateField(email, isEmailValid, 'Email is not valid');
        validateField(password, isPasswordValid, 'Password must be at least 8 characters long');

        return isNameValid && isEmailValid && isPasswordValid;
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

    async function showModal(isNameValid, isEmailValid, isPasswordValid) {
        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            Swal.fire({
                icon: 'error',
                title: 'Form Error',
                text: 'Verify your ' + (!isEmailValid ? 'email ' : '') + (!isEmailValid && !isPasswordValid ? 'and ' : '') + (!isPasswordValid ? 'password' : ''),
                footer: '<p><a href="#">Need help?</a></p>',
            });
        } else {
            await register();
        }
    }

    async function register(){
        const regUser = {
            "email": email.value,
            "password": password.value,
            "name": name.value
        }

        const res = await fetch(host+"/auth/register", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(regUser)
        }).then( async res=>{
            const body = await res.json();
            if(res.ok){
                Swal.fire({
                    icon: 'success',
                    title: 'Register Successful! Welcome aboard!',
                    text: 'Redirecting to login...',
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = host+'/login';
                }, 1500);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Register failed',
                    text: body["error"],
                    showConfirmButton: true
                });
            }
        }).catch(err=>{
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong: ',
                text: 'Internal error :p: '+err,
                showConfirmButton: true
            });
        });
    }
});