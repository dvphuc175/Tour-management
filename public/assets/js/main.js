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