// Flash message: tự động ẩn sau 4 giây
document.querySelectorAll('.flash').forEach(el => {
  setTimeout(() => {
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 4000);
});

// Confirm khi xóa / hủy
document.querySelectorAll('[data-confirm]').forEach(form => {
  form.addEventListener('submit', e => {
    const msg = form.dataset.confirm || 'Bạn có chắc muốn thực hiện thao tác này?';
    if (!confirm(msg)) e.preventDefault();
  });
});

// Password strength checker
const passwordInput = document.getElementById('password');
if (passwordInput) {
  const passwordBar = document.getElementById('passwordBar');
  const hintLength = document.getElementById('hint-length');
  const hintSpecial = document.getElementById('hint-special');

  function checkPasswordStrength(password) {
    const hasLength = password.length >= 6 && password.length <= 18;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const alphanumeric = hasNumber && hasLetter;
    
    // Update hint indicators
    if (alphanumeric) {
      hintLength.classList.add('checked');
    } else {
      hintLength.classList.remove('checked');
    }

    if (hasSpecial) {
      hintSpecial.classList.add('checked');
    } else {
      hintSpecial.classList.remove('checked');
    }

    // Calculate strength (0-3)
    let strength = 0;
    if (hasLength) strength++;
    if (alphanumeric) strength++;
    if (hasSpecial) strength++;

    // Update progress bar
    passwordBar.className = 'password-strength__progress';
    if (password.length === 0) {
      passwordBar.style.width = '0';
    } else if (strength === 1) {
      passwordBar.classList.add('weak');
    } else if (strength === 2) {
      passwordBar.classList.add('medium');
    } else if (strength >= 3) {
      passwordBar.classList.add('strong');
    }
  }

  passwordInput.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
  });
}