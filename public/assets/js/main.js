// Navbar mobile menu + scroll state
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const backdrop = document.querySelector('.navbar__backdrop');
  const closeButton = document.querySelector('[data-navbar-close]');
  if (!navbar || !toggle) return;

  const closeMenu = () => {
    navbar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    navbar.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  toggle.addEventListener('click', () => {
    if (navbar.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  backdrop?.addEventListener('click', closeMenu);
  closeButton?.addEventListener('click', closeMenu);

  navbar.querySelectorAll('.navbar__menu a, .navbar__auth a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) closeMenu();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) closeMenu();
  });

  // Navbar scroll state
  const updateNavbarScrollState = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  updateNavbarScrollState();
  window.addEventListener('scroll', updateNavbarScrollState);
})();

// Scroll animation library
(function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 70
  });
})();

// Auto apply scroll animations across pages
(function initGlobalScrollAnimations() {
  const animationGroups = [
    {
      selector: '.section-header, .page-header, .hero__content, .auth-card, .contact-map',
      effect: 'fade-up',
      baseDelay: 0,
      step: 0
    },
    {
      selector: '.tour-card, .feature-card, .category-card, .highlight-card, .experience-card, .booking-item, .stat-card, .report-card, .admin-card',
      effect: 'zoom-in-up',
      baseDelay: 30,
      step: 60
    },
    {
      selector: '.table-responsive, .booking-detail-card, .tour-detail-main, .tour-detail-sidebar, .profile-card, .sidebar-menu, .tab-content',
      effect: 'fade-up',
      baseDelay: 20,
      step: 50
    },
    {
      selector: 'form.card, .form-card, .payment-method-option, .review-item, .schedule-table-wrapper',
      effect: 'fade-up',
      baseDelay: 40,
      step: 60
    }
  ];

  window.applyGlobalAOS = function applyGlobalAOS(root = document) {
    animationGroups.forEach(group => {
      const nodes = root.querySelectorAll(group.selector);
      nodes.forEach((node, index) => {
        if (node.hasAttribute('data-aos')) return;
        node.setAttribute('data-aos', group.effect);
        const delay = Math.min(360, group.baseDelay + (index % 6) * group.step);
        if (delay > 0) node.setAttribute('data-aos-delay', String(delay));
      });
    });

    if (typeof AOS !== 'undefined') {
      AOS.refreshHard();
    }
  };

  window.applyGlobalAOS();
})();

// Tour filter drawer
(function initTourFilters() {
  const panel = document.getElementById('tourFilterPanel');
  const toggle = document.querySelector('[data-filter-toggle]');
  const closeButton = document.querySelector('[data-filter-close]');
  const backdrop = document.querySelector('[data-filter-backdrop]');
  if (!panel || !toggle) return;

  const closeFilter = () => {
    document.body.classList.remove('filter-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openFilter = () => {
    document.body.classList.add('filter-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('filter-open')) closeFilter();
    else openFilter();
  });

  closeButton?.addEventListener('click', closeFilter);
  backdrop?.addEventListener('click', closeFilter);

  panel.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', closeFilter);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeFilter();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeFilter();
  });
})();

// Flash message
document.querySelectorAll('[data-flash]').forEach(el => {
  const removeFlash = () => {
    el.style.transition = 'opacity .25s ease, transform .25s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    setTimeout(() => {
      const stack = el.closest('.flash-stack');
      el.remove();
      if (stack && !stack.querySelector('[data-flash]')) stack.remove();
    }, 250);
  };

  el.querySelector('[data-flash-close]')?.addEventListener('click', removeFlash);

  if (!el.classList.contains('flash-message--error')) {
    setTimeout(removeFlash, 5000);
  }
});

document.querySelectorAll('.flash').forEach(el => {
  setTimeout(() => {
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 4000);
});

// Flash messages: auto hide and close button
(function initFlashMessages() {
  const flashContainers = document.querySelectorAll('.flash');
  
  flashContainers.forEach(flashContainer => {
    const flashItems = flashContainer.querySelectorAll('.flash__item');
    
    flashItems.forEach(item => {
      // Auto hide after 5 seconds
      const autoHideTimeout = setTimeout(() => {
        closeFlashItem(item);
      }, 5000);
      
      // Close button click
      const closeBtn = item.querySelector('.flash__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          clearTimeout(autoHideTimeout);
          closeFlashItem(item);
        });
      }
    });
  });
  
  function closeFlashItem(item) {
    item.classList.add('is-closing');
    setTimeout(() => {
      item.remove();
      // If container is empty, remove it
      const container = item.closest('.flash');
      if (container && container.querySelectorAll('.flash__item').length === 0) {
        container.remove();
      }
    }, 300);
  }
})();

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
    const hasLength = password.length >= 8 && password.length <= 16;
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

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    
    const wrapper = toggle.closest('.password-input-wrapper');
    const input = wrapper.querySelector('input[type="password"], input[type="text"]');
    
    if (!input) return;
    
    // Toggle input type between password and text
    const icon = toggle.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      // toggle.classList.add('active');
      if (icon) {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    } else {
      input.type = 'password';
      // toggle.classList.remove('active');
      if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  });
});

// Utility functions used across all pagination modules
(function initCommonUtils() {
  window.renderStars = function(rating) {
    const r = Math.min(5, Math.max(0, Number(rating) || 0));
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++) {
      html += '<i class="fa-solid fa-star stars-fa stars-fa--full" aria-hidden="true"></i>';
    }
    if (half) {
      html += '<i class="fa-solid fa-star-half-stroke stars-fa stars-fa--half" aria-hidden="true"></i>';
    }
    for (let i = 0; i < empty; i++) {
      html += '<i class="fa-regular fa-star stars-fa stars-fa--empty" aria-hidden="true"></i>';
    }
    return html;
  };

  window.formatPrice = function(n) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(n);
  };

  window.formatDate = function(d) {
    return new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
})();

// AJAX Pagination for tour list
(function initTourListPagination() {
  function generateTourCard(tour) {
    let html = `<a class="tour-card" href="/tours/${tour.slug}">
      <div class="tour-card__img">`;
    
    if (tour.images && tour.images.length) {
      html += `<img src="${tour.images[0]}" alt="${tour.name}" loading="lazy">`;
    } else {
      html += `<div class="tour-card__img-placeholder"></div>`;
    }
    
    html += `</div><div class="tour-card__body">`;
    
    if (tour.category_name) {
      html += `<span class="tour-card__cat">${tour.category_name}</span>`;
    }
    
    html += `<h3 class="tour-card__name">${tour.name}</h3>`;
    
    if (tour.avg_rating && tour.review_count > 0) {
      html += `<div class="tour-card__rating">
        <span class="tour-card__rating-stars">${renderStars(tour.avg_rating)}</span>
        <span class="tour-card__rating-score">${tour.avg_rating}</span>
        <span class="tour-card__rating-count">(${tour.review_count} đánh giá)</span>
      </div>`;
    }
    
    html += `<div class="tour-card__meta">`;
    
    if (tour.next_departure) {
      html += `<span class="icon-text">
        <i class="fa-solid fa-calendar"></i> ${formatDate(tour.next_departure)}
      </span>`;
    }
    
    if (tour.total_available > 0) {
      html += `<span class="tour-card__slots">${tour.total_available} chỗ còn</span>`;
    } else {
      html += `<span class="tour-card__slots tour-card__slots--full">Hết chỗ</span>`;
    }
    
    html += `</div></div><div class="tour-card__footer">
      <span class="tour-card__price">${formatPrice(tour.price_adult)}</span>
      <span class="tour-card__cta">Xem chi tiết</span>
    </div></a>`;
    
    return html;
  }

  function buildQueryParams(query) {
    const params = new URLSearchParams();
    if (query.search && query.search.trim()) {
      params.set('search', query.search.trim());
    }
    if (query.category && query.category.trim()) {
      params.set('category', query.category);
    }
    if (query.min_price) {
      params.set('min_price', query.min_price);
    }
    if (query.max_price) {
      params.set('max_price', query.max_price);
    }
    return params.toString();
  }

  function generatePagination(data) {
    const { currentPage, totalPages, query } = data;
    const baseParams = buildQueryParams(query);
    let html = '';
    
    const buildUrl = (page) => {
      const params = new URLSearchParams(baseParams);
      if (page > 1) params.set('page', page);
      const paramString = params.toString();
      return `/tours${paramString ? '?' + paramString : ''}`;
    };
    
    if (currentPage > 1) {
      html += `<a class="pagination__item" href="${buildUrl(currentPage - 1)}">
        <i class="fa-solid fa-chevron-left"></i> Trước
      </a>`;
    }
    
    for (let p = 1; p <= totalPages; p++) {
      html += `<a href="${buildUrl(p)}" class="pagination__item${p === currentPage ? ' active' : ''}">${p}</a>`;
    }
    
    if (currentPage < totalPages) {
      html += `<a class="pagination__item" href="${buildUrl(currentPage + 1)}">
        Tiếp <i class="fa-solid fa-chevron-right"></i>
      </a>`;
    }
    
    return html;
  }

  async function loadPage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Update tour count
      const tourCountEl = document.getElementById('tourCount');
      if (tourCountEl) {
        tourCountEl.textContent = `Tìm thấy ${data.totalTours} tour`;
      }
      
      // Update tour grid or empty state
      const tourGridEl = document.getElementById('tourGrid');
      const tourEmptyStateEl = document.getElementById('tourEmptyState');
      
      if (data.tours.length === 0) {
        if (tourGridEl) tourGridEl.style.display = 'none';
        if (tourEmptyStateEl) tourEmptyStateEl.style.display = 'block';
      } else {
        if (tourEmptyStateEl) tourEmptyStateEl.style.display = 'none';
        if (tourGridEl) {
          tourGridEl.style.display = 'grid';
          tourGridEl.innerHTML = data.tours.map(tour => generateTourCard(tour)).join('');
        }
      }
      
      // Update pagination
      const paginationContainerEl = document.getElementById('paginationContainer');
      if (paginationContainerEl) {
        if (data.totalPages > 1) {
          paginationContainerEl.style.display = 'flex';
          paginationContainerEl.innerHTML = generatePagination(data);
        } else {
          paginationContainerEl.style.display = 'none';
        }
      }
      
      // Update URL without reload
      history.pushState(null, '', url);
      window.applyGlobalAOS?.();
      
      // Update filter form with current values
      updateFilterForm(data.query);
      
    } catch (error) {
      console.error('Error loading page:', error);
      window.location.href = url;
    }
  }

  function updateFilterForm(query) {
    const form = document.getElementById('filterForm');
    if (!form) return;
    
    // Update search input
    const searchInput = form.querySelector('input[name="search"]');
    if (searchInput) {
      searchInput.value = query.search || '';
    }
    
    // Update category radio buttons
    const categoryRadios = form.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => {
      if (radio.value === (query.category || '')) {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    });
    
    // Update min_price
    const minPriceInput = form.querySelector('input[name="min_price"]');
    if (minPriceInput) {
      minPriceInput.value = query.min_price || '';
    }
    
    // Update max_price
    const maxPriceInput = form.querySelector('input[name="max_price"]');
    if (maxPriceInput) {
      maxPriceInput.value = query.max_price || '';
    }
  }

  function handlePaginationClick(e) {
    const paginationItem = e.target.closest('.pagination__item');
    if (paginationItem) {
      e.preventDefault();
      const url = paginationItem.getAttribute('href');
      if (url) {
        loadPage(url);
      }
    }
  }

  function handleFilterFormSubmit(e) {
    e.preventDefault();
    const form = e.target.closest('#filterForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    // Add search
    const search = formData.get('search');
    if (search && search.trim()) {
      params.set('search', search.trim());
    }
    
    // Add category
    const category = formData.get('category');
    if (category) {
      params.set('category', category);
    }
    
    // Add min_price
    const minPrice = formData.get('min_price');
    if (minPrice) {
      params.set('min_price', minPrice);
    }
    
    // Add max_price
    const maxPrice = formData.get('max_price');
    if (maxPrice) {
      params.set('max_price', maxPrice);
    }
    
    const paramString = params.toString();
    const url = `/tours${paramString ? '?' + paramString : ''}`;
    loadPage(url);
  }

  function handleClearFilterClick(e) {
    const clearBtn = e.target.closest('a[href="/tours"]');
    if (clearBtn) {
      e.preventDefault();
      loadPage('/tours');
    }
  }

  // Initial setup
  const tourListContainer = document.getElementById('tourListContainer');
  if (tourListContainer) {
    tourListContainer.addEventListener('click', handlePaginationClick);
  }
  
  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', handleFilterFormSubmit);
    filterForm.addEventListener('click', handleClearFilterClick);
  }

  // Handle back/forward buttons
  window.addEventListener('popstate', () => {
    if (window.location.pathname === '/tours') {
      loadPage(window.location.href);
    }
  });
})();

// AJAX Pagination for home page
(function initHomePagination() {
  function generateHomePagination(data) {
    const { currentPage, totalPages } = data;
    let html = '';
    
    if (currentPage > 1) {
      html += `<a class="pagination__item" href="/?page=${currentPage - 1}">
        <i class="fa-solid fa-chevron-left"></i> Trước
      </a>`;
    }
    
    for (let p = 1; p <= totalPages; p++) {
      html += `<a href="/?page=${p}" class="pagination__item${p === currentPage ? ' active' : ''}">${p}</a>`;
    }
    
    if (currentPage < totalPages) {
      html += `<a class="pagination__item" href="/?page=${currentPage + 1}">
        Tiếp <i class="fa-solid fa-chevron-right"></i>
      </a>`;
    }
    
    return html;
  }

  async function loadHomePage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Update tour grid
      const homeTourGridEl = document.getElementById('homeTourGrid');
      if (homeTourGridEl) {
        homeTourGridEl.innerHTML = data.tours.map(tour => {
          let html = `<a class="tour-card" href="/tours/${tour.slug}">
            <div class="tour-card__img">`;
          
          if (tour.images && tour.images.length) {
            html += `<img src="${tour.images[0]}" alt="${tour.name}" loading="lazy">`;
          } else {
            html += `<div class="tour-card__img-placeholder"></div>`;
          }
          
          html += `</div><div class="tour-card__body">`;
          
          if (tour.category_name) {
            html += `<span class="tour-card__cat">${tour.category_name}</span>`;
          }
          
          html += `<h3 class="tour-card__name">${tour.name}</h3>`;
          
          if (tour.avg_rating && tour.review_count > 0) {
            html += `<div class="tour-card__rating">
              <span class="tour-card__rating-stars">${renderStars(tour.avg_rating)}</span>
              <span class="tour-card__rating-score">${tour.avg_rating}</span>
              <span class="tour-card__rating-count">(${tour.review_count} đánh giá)</span>
            </div>`;
          }
          
          html += `<div class="tour-card__meta">`;
          
          if (tour.next_departure) {
            html += `<span class="icon-text">
              <i class="fa-solid fa-calendar"></i> ${formatDate(tour.next_departure)}
            </span>`;
          }
          
          if (tour.total_available > 0) {
            html += `<span class="tour-card__slots">${tour.total_available} chỗ còn</span>`;
          } else {
            html += `<span class="tour-card__slots tour-card__slots--full">Hết chỗ</span>`;
          }
          
          html += `</div></div><div class="tour-card__footer">
            <span class="tour-card__price">${formatPrice(tour.price_adult)}</span>
            <span class="tour-card__cta">Xem chi tiết</span>
          </div></a>`;
          
          return html;
        }).join('');
      }
      
      // Update pagination
      const homePaginationEl = document.getElementById('homePagination');
      if (homePaginationEl) {
        if (data.totalPages > 1) {
          homePaginationEl.style.display = 'flex';
          homePaginationEl.innerHTML = generateHomePagination(data);
        } else {
          homePaginationEl.style.display = 'none';
        }
      }
      
      // Update URL without reload
      history.pushState(null, '', url);
      window.applyGlobalAOS?.();
      
    } catch (error) {
      console.error('Error loading home page:', error);
      window.location.href = url;
    }
  }

  function handleHomePaginationClick(e) {
    const paginationItem = e.target.closest('#homePagination .pagination__item');
    if (paginationItem) {
      e.preventDefault();
      const url = paginationItem.getAttribute('href');
      if (url) {
        loadHomePage(url);
      }
    }
  }

  // Initial setup
  const homeTourSection = document.getElementById('homeTourSection');
  if (homeTourSection) {
    homeTourSection.addEventListener('click', handleHomePaginationClick);
  }

  // Handle back/forward buttons
  window.addEventListener('popstate', () => {
    if (window.location.pathname === '/') {
      loadHomePage(window.location.href);
    }
  });
})();

// AJAX Pagination for my-bookings page
(function initMyBookingsPagination() {
  const BOOKING_STATUS_FALLBACK = {
    pending: { label: 'Chờ xác nhận', badge: 'pending' },
    confirmed: { label: 'Đã xác nhận', badge: 'confirmed' },
    cancelled: { label: 'Đã hủy', badge: 'cancelled' },
    completed: { label: 'Hoàn thành', badge: 'completed' }
  };

  function getBookingUi(b) {
    const fallback = BOOKING_STATUS_FALLBACK[b.status] || {
      label: b.status || 'Không rõ',
      badge: 'unknown'
    };

    return {
      statusLabel: b.ui?.bookingStatusLabel || fallback.label,
      statusBadge: b.ui?.bookingStatusBadge || fallback.badge,
      canCancel: b.ui?.canUserCancel ?? b.status === 'pending'
    };
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function generateBookingItem(b, csrfToken) {
    const bookingUi = getBookingUi(b);
    const tourName = escapeHtml(b.tour_name);
    const departureLocation = escapeHtml(b.departure_location);
    const tourSlug = encodeURIComponent(b.tour_slug || '');
    const imageSrc = b.tour_images && b.tour_images.length ? escapeHtml(b.tour_images[0]) : '';

    let html = `<div class="booking-item">
      <div class="booking-item__img">`;
    
    if (imageSrc) {
      html += `<img src="${imageSrc}" alt="${tourName}">`;
    } else {
      html += `<div class="booking-item__img-empty"></div>`;
    }
    
    html += `</div>
      <div class="booking-item__info">
        <a class="booking-item__tour" href="/tours/${tourSlug}">${tourName}</a>
        <div class="booking-item__meta">
          <span class="icon-text">
            <i class="fa-solid fa-calendar"></i> ${formatDate(b.start_date)} – ${formatDate(b.end_date)}
          </span>
          <span class="icon-text">
            <i class="fa-solid fa-location-dot"></i> ${departureLocation}
          </span>
          <span class="icon-text">
            <i class="fa-solid fa-users"></i> ${b.adult_count} Người lớn / ${b.child_count} Trẻ em
          </span>
        </div>
        <div class="booking-item__price">${formatPrice(b.total_price)}</div>
      </div>
      <div class="booking-item__status">
        <span class="badge badge--${escapeHtml(bookingUi.statusBadge)}">${escapeHtml(bookingUi.statusLabel)}</span>
        <a class="btn btn--view btn--sm" href="/my-bookings/${b.id}">Chi tiết</a>`;
    if (bookingUi.canCancel) {
      html += `<form action="/my-bookings/${b.id}/cancel?_method=PUT" method="POST" data-confirm="Bạn chắc chắn muốn hủy đơn này?">
        <input type="hidden" name="_csrf" value="${csrfToken}">
        <button class="btn btn--danger btn--sm" type="submit">Hủy đơn</button>
      </form>`;
    }
    
    html += `</div></div>`;
    return html;
  }

  function generateMyBookingsPagination(data) {
    const { currentPage, totalPages } = data;
    let html = '';
    
    if (currentPage > 1) {
      html += `<a class="pagination__item" href="/my-bookings?page=${currentPage - 1}">
        <i class="fa-solid fa-chevron-left"></i> Trước
      </a>`;
    }
    
    for (let p = 1; p <= totalPages; p++) {
      html += `<a href="/my-bookings?page=${p}" class="pagination__item${p === currentPage ? ' active' : ''}">${p}</a>`;
    }
    
    if (currentPage < totalPages) {
      html += `<a class="pagination__item" href="/my-bookings?page=${currentPage + 1}">
        Tiếp <i class="fa-solid fa-chevron-right"></i>
      </a>`;
    }
    
    return html;
  }

  async function loadMyBookingsPage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Get CSRF token from meta tag or existing form
      let csrfToken = '';
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      if (csrfMeta) {
        csrfToken = csrfMeta.content;
      } else {
        const csrfInput = document.querySelector('input[name="_csrf"]');
        if (csrfInput) {
          csrfToken = csrfInput.value;
        }
      }
      
      // Update bookings or empty state
      const myBookingsListEl = document.getElementById('myBookingsList');
      const myBookingsEmptyStateEl = document.getElementById('myBookingsEmptyState');
      
      if (data.bookings.length === 0) {
        if (myBookingsListEl) myBookingsListEl.style.display = 'none';
        if (myBookingsEmptyStateEl) myBookingsEmptyStateEl.style.display = 'block';
      } else {
        if (myBookingsEmptyStateEl) myBookingsEmptyStateEl.style.display = 'none';
        if (myBookingsListEl) {
          myBookingsListEl.style.display = '';
          myBookingsListEl.innerHTML = data.bookings.map(b => generateBookingItem(b, csrfToken)).join('');
        }
      }
      
      // Update pagination
      const myBookingsPaginationEl = document.getElementById('myBookingsPagination');
      if (myBookingsPaginationEl) {
        if (data.totalPages > 1) {
          myBookingsPaginationEl.style.display = 'flex';
          myBookingsPaginationEl.innerHTML = generateMyBookingsPagination(data);
        } else {
          myBookingsPaginationEl.style.display = 'none';
        }
      }
      
      // Update URL without reload
      history.pushState(null, '', url);
      window.applyGlobalAOS?.();
      
    } catch (error) {
      console.error('Error loading my bookings page:', error);
      window.location.href = url;
    }
  }

  function handleMyBookingsPaginationClick(e) {
    const paginationItem = e.target.closest('#myBookingsPagination .pagination__item');
    if (paginationItem) {
      e.preventDefault();
      const url = paginationItem.getAttribute('href');
      if (url) {
        loadMyBookingsPage(url);
      }
    }
  }

  // Initial setup
  const myBookingsContainer = document.getElementById('myBookingsContainer');
  if (myBookingsContainer) {
    myBookingsContainer.addEventListener('click', handleMyBookingsPaginationClick);
  }

  // Handle back/forward buttons
  window.addEventListener('popstate', () => {
    if (window.location.pathname === '/my-bookings') {
      loadMyBookingsPage(window.location.href);
    }
  });
})();

// AJAX Pagination for reviews on tour detail page
(function initReviewsPagination() {
  function generateReviewItem(rv) {
    let html = `<div class="review-item">
      <div class="review-item__header">
        <span class="review-item__author">${rv.user_name}</span>
        <span class="review-item__stars">${renderStars(rv.rating)}</span>
        <span class="review-item__date">${formatDate(rv.created_at)}</span>
      </div>`;
    
    if (rv.comment) {
      html += `<p class="review-item__comment">${rv.comment}</p>`;
    }
    
    html += `</div>`;
    return html;
  }

  function generateReviewsPagination(data) {
    const { reviewPage, reviewTotalPages, tourSlug } = data;
    const reviewBase = `/tours/${tourSlug}?review_page=`;
    let html = '';
    
    if (reviewPage > 1) {
      html += `<a class="pagination__item" href="${reviewBase}${reviewPage - 1}#reviews">
        <i class="fa-solid fa-chevron-left"></i> Trước
      </a>`;
    }
    
    for (let p = 1; p <= reviewTotalPages; p++) {
      html += `<a href="${reviewBase}${p}#reviews" class="pagination__item${p === reviewPage ? ' active' : ''}">${p}</a>`;
    }
    
    if (reviewPage < reviewTotalPages) {
      html += `<a class="pagination__item" href="${reviewBase}${reviewPage + 1}#reviews">
        Tiếp <i class="fa-solid fa-chevron-right"></i>
      </a>`;
    }
    
    return html;
  }

  async function loadReviewsPage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Update reviews or no reviews message
      const reviewsListEl = document.getElementById('reviewsList');
      const noReviewsEl = document.getElementById('noReviews');
      
      if (!data.reviews || data.reviews.length === 0) {
        if (reviewsListEl) reviewsListEl.style.display = 'none';
        if (noReviewsEl) noReviewsEl.style.display = 'block';
      } else {
        if (noReviewsEl) noReviewsEl.style.display = 'none';
        if (reviewsListEl) {
          reviewsListEl.style.display = 'block';
          reviewsListEl.innerHTML = data.reviews.map(rv => generateReviewItem(rv)).join('');
        }
      }
      
      // Update pagination
      const reviewsPaginationEl = document.getElementById('reviewsPagination');
      if (reviewsPaginationEl) {
        if (data.reviewTotalPages > 1) {
          reviewsPaginationEl.style.display = 'flex';
          reviewsPaginationEl.innerHTML = generateReviewsPagination(data);
        } else {
          reviewsPaginationEl.style.display = 'none';
        }
      }
      
      // Update URL without reload
      history.pushState(null, '', url);
      window.applyGlobalAOS?.();
      
      // Scroll to reviews section
      const reviewsSection = document.getElementById('reviews');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
      }
      
    } catch (error) {
      console.error('Error loading reviews:', error);
      window.location.href = url;
    }
  }

  function handleReviewsPaginationClick(e) {
    const paginationItem = e.target.closest('#reviewsPagination .pagination__item');
    if (paginationItem) {
      e.preventDefault();
      const url = paginationItem.getAttribute('href');
      if (url) {
        loadReviewsPage(url);
      }
    }
  }

  // Initial setup
  const reviewsSection = document.getElementById('reviews');
  if (reviewsSection) {
    reviewsSection.addEventListener('click', handleReviewsPaginationClick);
  }
})();

// Contact page: Toggle admin info
(function initContactToggle() {
  const toggleBtn = document.getElementById('toggleAdminInfo');
  const adminInfo = document.getElementById('adminContactInfo');
  
  if (toggleBtn && adminInfo) {
    toggleBtn.addEventListener('click', () => {
      adminInfo.classList.toggle('show');
      
      // Update button text and icon
      const icon = toggleBtn.querySelector('i');
      if (adminInfo.classList.contains('show')) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ẩn thông tin quản trị viên & Hotline';
      } else {
        toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Hiển thị thông tin quản trị viên & Hotline';
      }
    });
  }
})();

// Account Page - Tab Switching & Edit Profile
(function initAccountPage() {
  // Tab switching
  const menuItems = document.querySelectorAll('.sidebar-menu-item');
  const tabContents = document.querySelectorAll('.tab-content');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      // Update active menu item
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      // Show corresponding tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${targetTab}-tab`) {
          content.classList.add('active');
        }
      });
    });
  });

  // Edit Profile functionality
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const profileViewSection = document.querySelector('.profile-view-section');
  const profileEditSection = document.querySelector('.profile-edit-section');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (profileViewSection) profileViewSection.classList.add('hidden');
      if (profileEditSection) profileEditSection.classList.remove('hidden');
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      if (profileEditSection) profileEditSection.classList.add('hidden');
      if (profileViewSection) profileViewSection.classList.remove('hidden');
    });
  }

  // Password Toggle (Show/Hide) functionality
  const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');

  passwordToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-input-wrapper');
      if (!wrapper) return;

      const input = wrapper.querySelector('.form-control-password');
      const icon = btn.querySelector('i');

      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
})();

