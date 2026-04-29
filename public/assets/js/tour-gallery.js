// Gallery state
let galleryImages = [];
let currentImageIndex = 0;

function initGallery() {
	const thumbs = document.querySelectorAll('.tour-gallery__thumb');
	galleryImages = Array.from(thumbs).map(thumb => thumb.src);
	
	// Find current index based on main image
	const mainImg = document.getElementById('mainImg');
	if (mainImg) {
		currentImageIndex = galleryImages.findIndex(src => src === mainImg.src);
		if (currentImageIndex === -1) currentImageIndex = 0;
	}
}

function switchImg(thumb, src) {
	document.getElementById('mainImg').src = src;
	document.querySelectorAll('.tour-gallery__thumb')
		.forEach(t => t.classList.remove('active'));
	thumb.classList.add('active');
	
	// Update current index
	const thumbs = document.querySelectorAll('.tour-gallery__thumb');
	galleryImages = Array.from(thumbs).map(t => t.src);
	currentImageIndex = galleryImages.findIndex(s => s === src);
}

function showImageAtIndex(index) {
	if (!galleryImages.length) initGallery();
	if (index < 0 || index >= galleryImages.length) return;
	
	const src = galleryImages[index];
	const mainImg = document.getElementById('mainImg');
	if (mainImg) mainImg.src = src;
	
	// Update active thumbnail
	document.querySelectorAll('.tour-gallery__thumb').forEach((t, i) => {
		t.classList.toggle('active', i === index);
	});
	
	// Scroll thumbnail into view
	const activeThumb = document.querySelectorAll('.tour-gallery__thumb')[index];
	if (activeThumb) {
		activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	}
	
	currentImageIndex = index;
}

function nextImage() {
	if (!galleryImages.length) initGallery();
	if (!galleryImages.length) return;
	
	// Loop back to first if at end
	const nextIndex = (currentImageIndex + 1) % galleryImages.length;
	showImageAtIndex(nextIndex);
}

function prevImage() {
	if (!galleryImages.length) initGallery();
	if (!galleryImages.length) return;
	
	// Loop to last if at beginning
	const prevIndex = currentImageIndex <= 0 ? galleryImages.length - 1 : currentImageIndex - 1;
	showImageAtIndex(prevIndex);
}

function scrollThumbs(direction) {
	const container = document.getElementById('thumbsContainer');
	if (!container) return;

	const scrollAmount = 200;
	const currentScroll = container.scrollLeft;

	if (direction === 'left') {
		container.scrollTo({
			left: currentScroll - scrollAmount,
			behavior: 'smooth'
		});
	} else {
		container.scrollTo({
			left: currentScroll + scrollAmount,
			behavior: 'smooth'
		});
	}
}

function updateActiveThumbFromScroll() {
	const container = document.getElementById('thumbsContainer');
	const mainImg = document.getElementById('mainImg');
	if (!container || !mainImg) return;

	const thumbs = container.querySelectorAll('.tour-gallery__thumb');
	const mainSrc = mainImg.src;

	thumbs.forEach(thumb => {
		thumb.classList.remove('active');
		if (thumb.src === mainSrc) {
			thumb.classList.add('active');
		}
	});
}

// Toggle schedule row expansion (plus/minus button)
function toggleScheduleDetail(scheduleId) {
	const detailRow = document.getElementById(`detail-${scheduleId}`);
	const plusIcon = document.getElementById(`icon-plus-${scheduleId}`);
	const minusIcon = document.getElementById(`icon-minus-${scheduleId}`);

	if (!detailRow) return;

	const isHidden = detailRow.classList.contains('hidden');

	if (isHidden) {
		detailRow.classList.remove('hidden');
		detailRow.classList.add('active');
		if (plusIcon) plusIcon.classList.add('hidden');
		if (minusIcon) minusIcon.classList.remove('hidden');
	} else {
		detailRow.classList.add('hidden');
		detailRow.classList.remove('active');
		if (plusIcon) plusIcon.classList.remove('hidden');
		if (minusIcon) minusIcon.classList.add('hidden');
	}
}

// Toggle price detail row
function togglePriceDetail(scheduleId) {
	const detailRow = document.getElementById(`detail-${scheduleId}`);
	const eyeIcon = document.getElementById(`eye-${scheduleId}`);
	const eyeSlashIcon = document.getElementById(`eye-slash-${scheduleId}`);

	if (!detailRow) return;

	const isHidden = detailRow.classList.contains('hidden');

	if (isHidden) {
		// Show detail
		detailRow.classList.remove('hidden');
		detailRow.classList.add('active');
		if (eyeIcon) eyeIcon.classList.add('hidden');
		if (eyeSlashIcon) eyeSlashIcon.classList.remove('hidden');
	} else {
		// Hide detail
		detailRow.classList.add('hidden');
		detailRow.classList.remove('active');
		if (eyeIcon) eyeIcon.classList.remove('hidden');
		if (eyeSlashIcon) eyeSlashIcon.classList.add('hidden');
	}
}

// Scroll spy for sticky navigation
function updateActiveNavLink() {
	const sections = document.querySelectorAll('.tour-section[id]');
	const navLinks = document.querySelectorAll('.tour-nav-link');

	if (!sections.length || !navLinks.length) return;

	const scrollPos = window.scrollY + 150;

	sections.forEach(section => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight;
		const sectionId = section.getAttribute('id');

		if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
			navLinks.forEach(link => {
				link.classList.remove('active');
				if (link.getAttribute('href') === '#' + sectionId) {
					link.classList.add('active');
				}
			});
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	// Initialize gallery
	initGallery();
	
	const container = document.getElementById('thumbsContainer');
	if (container) {
		container.addEventListener('scroll', updateActiveThumbFromScroll);
	}

	// Scroll spy for navigation
	window.addEventListener('scroll', updateActiveNavLink);
	// Initial call to set active state
	updateActiveNavLink();

	// Smooth scroll for nav links
	document.querySelectorAll('.tour-nav-link').forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href').substring(1);
			const targetSection = document.getElementById(targetId);
			if (targetSection) {
				targetSection.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

	// Accordion functionality for itinerary
	initItineraryAccordion();

	// Keyboard navigation for gallery
	document.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevImage();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			nextImage();
		}
	});
});

// Initialize itinerary accordion
function initItineraryAccordion() {
	const itineraryContainer = document.querySelector('.tour-itinerary');
	if (!itineraryContainer) return;

	// Wrap each day's content in accordion structure
	wrapItineraryDays(itineraryContainer);

	// Add click handlers to headers
	const headers = document.querySelectorAll('.itinerary-day__header');
	headers.forEach(header => {
		header.addEventListener('click', function() {
			const dayItem = this.closest('.itinerary-day');
			const isActive = dayItem.classList.contains('active');

			// Close all other days (accordion behavior)
			document.querySelectorAll('.itinerary-day').forEach(day => {
				day.classList.remove('active');
			});

			// Toggle current day
			if (!isActive) {
				dayItem.classList.add('active');
			}
		});
	});
}

// Wrap itinerary content into accordion structure
function wrapItineraryDays(container) {
	const children = Array.from(container.children);
	let currentDay = null;
	let dayContent = [];

	// Clear container
	container.innerHTML = '';

	children.forEach(child => {
		if (child.tagName === 'H3') {
			// Save previous day if exists
			if (currentDay && dayContent.length) {
				appendDayToContainer(container, currentDay, dayContent);
			}
			// Start new day
			currentDay = child.textContent;
			dayContent = [];
		} else if (currentDay) {
			dayContent.push(child);
		}
	});

	// Don't forget the last day
	if (currentDay && dayContent.length) {
		appendDayToContainer(container, currentDay, dayContent);
	}
}

// Create and append day element to container
function appendDayToContainer(container, dayTitle, content) {
	const dayDiv = document.createElement('div');
	dayDiv.className = 'itinerary-day';

	// Create header
	const header = document.createElement('div');
	header.className = 'itinerary-day__header';
	header.innerHTML = `
		<span>${dayTitle}</span>
		<span class="itinerary-day__toggle">▼</span>
	`;

	// Create content wrapper
	const contentDiv = document.createElement('div');
	contentDiv.className = 'itinerary-day__content';

	// Move all content into the wrapper
	content.forEach(el => {
		contentDiv.appendChild(el);
	});

	dayDiv.appendChild(header);
	dayDiv.appendChild(contentDiv);
	container.appendChild(dayDiv);
}