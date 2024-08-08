import '@babel/polyfill';  
import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';

// Dom elements 
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        // Values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email,password);
    });
}

if(logOutBtn) logOutBtn.addEventListener('click', logout);

if(updateDataForm){
    updateDataForm.addEventListener('submit', e => {

        e.preventDefault();
        // VALUES
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const data = {name , email};

        updateSettings(data,'data');
    });
};

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent = 'Updating...';

        // VALUES
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';

        document.querySelector('.btn--save-password').textContent = 'Save Password';
    })
};


