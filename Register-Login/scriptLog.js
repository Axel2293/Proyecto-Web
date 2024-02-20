document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mainForm');
    // const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        if(checkInputs()){
            showModal();
            setTimeout(() => {
                window.location.href = '../Dashboard/dashboard.html';
            }, 3000);
        }
    });

    // name.addEventListener('input', () => {
    //     validateField(name, name.value.trim() !== '', 'Name cannot be blank');
    // });

    email.addEventListener('input', () => {
        validateField(email, isEmail(email.value.trim()), 'Email is not valid');
    });

    password.addEventListener('input', () => {
        validateField(password, password.value.trim().length >= 8, 'Password must be at least 8 characters');
    });

    function checkInputs() {
        let valid = true;
        // validateField(name, name.value.trim() !== '', 'Name cannot be blank');
        validateField(email, isEmail(email.value.trim()), 'Email is not valid');
        validateField(password, password.value.trim().length >= 8, 'Password must be at least 8 characters');
        
        document.querySelectorAll('.form-control').forEach(control => {
            if(control.classList.contains('error')){
                valid = false;
            }
        });
        return valid;
    }
    
    function validateField(input, condition, errorMessage){
        if(condition){
            setSuccess(input);
        } else {
            setError(input, errorMessage);
        }
    }

    function setError(input, message){
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.className = 'form-control error';
        icon.className = 'icon fas fa-times-circle';
        input.placeholder = message;
    }

    function setSuccess(input){
        const formControl = input.parentElement;
        const icon = formControl.querySelector('.icon');
        formControl.className = 'form-control success';
        icon.className = 'icon fas fa-check-circle';
    }

    function isEmail(email){
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    }

    function showModal(){
        const modal = document.getElementById('successModal');
        modal.style.display = 'block';

        const closeBtn = document.querySelector('.close-button');
        closeBtn.onclick = function(){
            modal.style.display = 'none';
        };

        window.onclick = function(e){
            if(e.target == modal){
                modal.style.display = 'none';
            }
        };
    }
});