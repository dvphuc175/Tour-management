function switchImg(thumb, src) {
	document.getElementById('mainImg').src = src;
	document.querySelectorAll('.tour-gallery__thumb')
		.forEach(t => t.classList.remove('active'));
	thumb.classList.add('active');
}