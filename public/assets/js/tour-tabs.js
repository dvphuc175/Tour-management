/**
 * Tour Tabs and Modal Functionality
 */

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tour-tabs__btn');
    const tabContents = document.querySelectorAll('.tour-tabs__content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to current button and content
            this.classList.add('active');
            const targetContent = document.getElementById('tab-' + tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Star rating functionality
    const stars = document.querySelectorAll('.tour-reviews__stars-input .star');
    let currentRating = 0;

    stars.forEach((star, index) => {
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating);
        });

        // Click to set rating
        star.addEventListener('click', function() {
            currentRating = parseInt(this.getAttribute('data-rating'));
            updateStars(currentRating);
        });
    });

    // Reset stars on mouse leave if not clicked
    const starsContainer = document.querySelector('.tour-reviews__stars-input');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            updateStars(currentRating);
        });
    }

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Review form submission
    const reviewForm = document.querySelector('.tour-reviews__form form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const comment = this.querySelector('textarea').value;

            if (!name.trim() || !comment.trim()) {
                alert('Vui lòng nhập đầy đủ họ tên và nội dung đánh giá.');
                return;
            }

            if (currentRating === 0) {
                alert('Vui lòng chọn số sao đánh giá.');
                return;
            }

            // Here you would normally send the review to the server
            alert('Cảm ơn bạn đã gửi đánh giá!');
            this.reset();
            currentRating = 0;
            updateStars(0);
        });
    }

    // Callback form submission
    const callbackForm = document.querySelector('.tour-callback__form');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = this.querySelector('input[type="tel"]').value;

            if (!phone.trim()) {
                alert('Vui lòng nhập số điện thoại.');
                return;
            }

            // Simple phone validation
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Vui lòng nhập số điện thoại hợp lệ (10-11 số).');
                return;
            }

            alert('Chúng tôi sẽ gọi điện tư vấn cho bạn trong thời gian sớm nhất!');
            this.reset();
        });
    }
});

// Schedule Modal Functions
function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeScheduleModal();
    }
});

// Lightbox functionality for images
let currentImageIndex = 0;
let tourImages = [];

function openLightbox(index) {
    tourImages = Array.from(document.querySelectorAll('.tour-images__item')).map(img => img.src);
    currentImageIndex = index;
    
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('tourLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'tourLightbox';
        lightbox.className = 'tour-lightbox';
        lightbox.innerHTML = `
            <div class="tour-lightbox__overlay" onclick="closeLightbox()"></div>
            <button class="tour-lightbox__close" onclick="closeLightbox()">&times;</button>
            <button class="tour-lightbox__nav tour-lightbox__prev" onclick="prevLightboxImage()">&#8249;</button>
            <img class="tour-lightbox__img" src="" alt="">
            <button class="tour-lightbox__nav tour-lightbox__next" onclick="nextLightboxImage()">&#8250;</button>
        `;
        document.body.appendChild(lightbox);
        
        // Add lightbox styles
        const style = document.createElement('style');
        style.textContent = `
            .tour-lightbox {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 2000;
                align-items: center;
                justify-content: center;
            }
            .tour-lightbox.active {
                display: flex;
            }
            .tour-lightbox__overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.9);
            }
            .tour-lightbox__img {
                position: relative;
                max-width: 90%;
                max-height: 90vh;
                object-fit: contain;
                z-index: 1;
            }
            .tour-lightbox__close {
                position: absolute;
                top: 20px;
                right: 40px;
                background: none;
                border: none;
                color: #fff;
                font-size: 40px;
                cursor: pointer;
                z-index: 2;
            }
            .tour-lightbox__nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                font-size: 40px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 2;
                transition: background 0.2s;
            }
            .tour-lightbox__nav:hover {
                background: rgba(255,255,255,0.4);
            }
            .tour-lightbox__prev {
                left: 20px;
            }
            .tour-lightbox__next {
                right: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('tourLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateLightboxImage() {
    const lightbox = document.getElementById('tourLightbox');
    if (lightbox && tourImages[currentImageIndex]) {
        lightbox.querySelector('.tour-lightbox__img').src = tourImages[currentImageIndex];
    }
}

function nextLightboxImage() {
    currentImageIndex = (currentImageIndex + 1) % tourImages.length;
    updateLightboxImage();
}

function prevLightboxImage() {
    currentImageIndex = (currentImageIndex - 1 + tourImages.length) % tourImages.length;
    updateLightboxImage();
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
    if (e.key === 'ArrowRight') {
        const lightbox = document.getElementById('tourLightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            nextLightboxImage();
        }
    }
    if (e.key === 'ArrowLeft') {
        const lightbox = document.getElementById('tourLightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            prevLightboxImage();
        }
    }
});
