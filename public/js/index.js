import '@babel/polyfill';  
import { login } from './login';
import { logout } from './login';
import { updateData } from './updateSettings';

// Dom elements 
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');

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

        updateData(name,email);
    });
}

