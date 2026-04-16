// Preview ảnh trước khi upload
const input   = document.getElementById('imageUpload');
const preview = document.getElementById('uploadPreview');

input?.addEventListener('change', () => {
	preview.innerHTML = '';
	[...input.files].forEach(file => {
		if (!file.type.startsWith('image/')) return;
		const reader = new FileReader();
		reader.onload = e => {
			const div = document.createElement('div');
			div.className = 'upload-thumb';
			div.innerHTML = `<img src="${e.target.result}" alt="${file.name}">
				<span>${(file.size/1024).toFixed(0)} KB</span>`;
			preview.appendChild(div);
		};
		reader.readAsDataURL(file);
	});
});

// Gạch xám ảnh bỏ chọn "giữ lại"
function toggleImgKeep(checkbox) {
	const img = checkbox.closest('.image-preview-item').querySelector('img');
	img.style.opacity = checkbox.checked ? '1' : '0.3';
}