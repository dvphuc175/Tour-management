const TourModel = require('../models/TourModel');
const CategoryModel = require('../models/CategoryModel');
const ScheduleModel = require('../models/ScheduleModel');
const ReviewModel = require('../models/ReviewModel');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const LIMIT = 9; 
const HOME_LIMIT = 8; // 6 tours per page on homepage
const REVIEW_LIMIT = 5;

// Danh mục tiêu biểu cho section "Điểm đến nổi bật" (slug → ảnh minh họa)
const HIGHLIGHT_CATEGORY_SLUGS = ['tour-bien-dao', 'tour-van-hoa', 'tour-nui-rung'];
const HIGHLIGHT_CATEGORY_IMAGES = {
  'tour-bien-dao': '/assets/images/slide2.jpg',
  'tour-van-hoa': '/assets/images/slide1.jpg',
  'tour-nui-rung': '/assets/images/slide3.jpg'
};

const ClientController = {
  // GET /
  async home(req, res, next) {
    try {
      console.log('[DEBUG] Trang chủ - Session user:', req.session.user ? 'Có' : 'Không');
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const offset = (page - 1) * HOME_LIMIT;

      const [featuredTours, tours, total, categories] = await Promise.all([
        TourModel.getFeatured(HOME_LIMIT),
        TourModel.getPublic({ limit: HOME_LIMIT, offset }),
        TourModel.countPublic({}),
        CategoryModel.getActive()
      ]);

      const highlightCategories = HIGHLIGHT_CATEGORY_SLUGS.map((slug) => {
        const cat = categories.find((c) => c.slug === slug);
        if (!cat) return null;
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: HIGHLIGHT_CATEGORY_IMAGES[slug] || '/assets/images/slide1.jpg',
          href: `/tours?category=${cat.id}`
        };
      }).filter(Boolean);

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
          tours,
          totalTours: total,
          currentPage: page,
          totalPages: Math.ceil(total / HOME_LIMIT)
        });
      }

      return res.render('client/home', {
        title: 'Trang chủ',
        tours: featuredTours,
        highlightCategories,
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / HOME_LIMIT),
        totalTours: total,
        query: req.query
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /about
  async about(req, res, next) {
    try {
      return res.render('client/about', {
        title: 'Giới thiệu'
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /contact
  async contact(req, res, next) {
    try {
      return res.render('client/contact', {
        title: 'Liên hệ'
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /contact
  async submitContact(req, res, next) {
    try {
      const { fullname, email, phone, message } = req.body;

      if (!fullname || !email || !message) {
        req.flash('error', 'Vui lòng nhập đầy đủ họ tên, email và nội dung tin nhắn.');
        return res.redirect('/contact');
      }

      console.log('[CONTACT FORM]', { fullname, email, phone, message });
      req.flash('success', 'Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.');
      return res.redirect('/contact');
    } catch (err) {
      next(err);
    }
  },

  // GET /tours
  async tourList(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const offset = (page - 1) * LIMIT;

      const categoryId = req.query.category || null;
      const search = req.query.search?.trim() || null;
      const minPrice = req.query.min_price
        ? parseInt(req.query.min_price)
        : null;
      const maxPrice = req.query.max_price
        ? parseInt(req.query.max_price)
        : null;

      const filters = {
        categoryId,
        search,
        minPrice,
        maxPrice
      };

      const [tours, total, categories] = await Promise.all([
        TourModel.getPublic({
          limit: LIMIT,
          offset,
          ...filters
        }),
        TourModel.countPublic(filters),
        CategoryModel.getActive()
      ]);

      // Helper functions for JSON response
      const formatPrice = (n) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(n);

      const formatDate = (d) =>
        new Date(d).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

      const renderStars = (rating) => {
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

      // Check if request is AJAX
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
          tours,
          totalTours: total,
          currentPage: page,
          totalPages: Math.ceil(total / LIMIT),
          query: req.query,
          helpers: { formatPrice, formatDate, renderStars }
        });
      }

      return res.render('client/tour-list', {
        title: 'Khám phá tour',
        tours,
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / LIMIT),
        totalTours: total,
        query: req.query
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /tours/:slug
  async tourDetail(req, res, next) {
    try {
      const tour = await TourModel.findBySlug(req.params.slug);

      if (!tour) {
        req.flash('error', 'Tour không tồn tại hoặc đã bị ẩn');
        return res.redirect('/tours');
      }

      const reviewPage = Math.max(1, parseInt(req.query.review_page) || 1);
      const reviewOffset = (reviewPage - 1) * REVIEW_LIMIT;

      const [schedules, reviews, ratingInfo, reviewTotal] = await Promise.all([
        ScheduleModel.getAvailableByTourId(tour.id),
        ReviewModel.getByTourId(tour.id, {
          limit: REVIEW_LIMIT,
          offset: reviewOffset
        }),
        ReviewModel.getAvgRating(tour.id),
        ReviewModel.countByTourId(tour.id)
      ]);

      const reviewTotalPages = Math.ceil(reviewTotal / REVIEW_LIMIT) || 1;

      // Kiểm tra quyền review
      let canReview = false;
      let hasReviewed = false;

      if (req.session.user) {
        [canReview, hasReviewed] = await Promise.all([
          ReviewModel.hasCompletedBooking(
            req.session.user.id,
            tour.id
          ),
          ReviewModel.hasReviewed(
            req.session.user.id,
            tour.id
          )
        ]);
      }

      // Check if request is for reviews JSON only
      if (req.headers.accept && req.headers.accept.includes('application/json') && req.query.review_page) {
        return res.json({
          reviews,
          reviewPage,
          reviewTotalPages,
          reviewTotal,
          tourSlug: tour.slug
        });
      }
      
      // Parse description into sections
      const sections = parseTourDescription(tour.description);

      return res.render('client/tour-detail', {
        title: tour.name,
        tour,
        schedules,
        reviews,
        ratingInfo,
        reviewPage,
        reviewTotalPages,
        reviewTotal,
        canReview,
        hasReviewed,
        sections
      });
    } catch (err) {
      next(err);
    }
  }
};

// Helper function to parse tour description into sections
// Supports both: <!-- SECTION:name -->...<!-- ENDSECTION --> format
// and plain HTML with h3/h4 headings as section names
function parseTourDescription(description) {
  if (!description) return {};

  console.log('[parseTourDescription] Starting with description length:', description.length);

  // Decode HTML entities if content is HTML-encoded (e.g., &lt; → <)
  // This handles cases where HTML comments got encoded in the database
  description = description
    .replace(/&lt;!--/g, '<!--')
    .replace(/--&gt;/g, '-->')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const sections = {};

  // Try format with section markers first
  // FIX 1: Improved regex to handle both ENDSECTION and next SECTION as delimiters
  const sectionRegex = /<!--\s*SECTION:\s*(\w+)\s*-->([\s\S]*?)(?=<!--\s*(?:SECTION:\s*\w+|ENDSECTION)\s*-->|$)/gi;
  let hasMarkers = false;
  let match;

  console.log('[parseTourDescription] Checking for SECTION markers...');
  while ((match = sectionRegex.exec(description)) !== null) {
    hasMarkers = true;
    const sectionName = match[1].toLowerCase().trim();
    let sectionContent = match[2].trim();
    // Remove any trailing ENDSECTION comment if present in the captured content
    sectionContent = sectionContent.replace(/<!--\s*ENDSECTION\s*-->\s*$/i, '').trim();
    sections[sectionName] = sectionContent;
    console.log(`[parseTourDescription] Found marker section: ${sectionName} (length: ${sectionContent.length})`);
  }

  // If no markers found, parse from HTML headings (h2, h3, h4)
  if (!hasMarkers) {
    console.log('[parseTourDescription] No markers found, parsing from headings...');
    // Map Vietnamese headings to section keys
    const headingMap = {
      'giới thiệu': 'overview',
      'giới thiệu tour': 'overview',
      'tổng quan': 'overview',
      'điểm nổi bật': 'highlights',
      'điểm đặc biệt': 'highlights',
      'lịch trình': 'itinerary',
      'lịch trình chi tiết': 'itinerary',
      'chương trình': 'itinerary',
      'chương trình tour': 'itinerary',
      'dịch vụ': 'services',
      'dịch vụ bao gồm': 'services',
      'dịch vụ đi kèm': 'services',
      'bảng giá': 'pricing',
      'bảng giá chi tiết': 'pricing',
      'giá tour': 'pricing',
      'lưu ý': 'notes',
      'lưu ý quan trọng': 'notes',
      'lưu ý khi đi tour': 'notes',
      'chính sách': 'notes'
    };

    // Split by h2, h3, h4 tags
    const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>([\s\S]*?)(?=<h[2-4]|$)/gi;

    while ((match = headingRegex.exec(description)) !== null) {
      const headingText = match[2].replace(/<[^>]*>/g, '').trim().toLowerCase();
      const content = match[3].trim();
      console.log(`[parseTourDescription] Found heading: "${headingText}", content length: ${content.length}`);
      let matched = false;

      // Find matching section key - EXACT match first, then includes
      for (const [key, sectionKey] of Object.entries(headingMap)) {
        if (headingText === key.toLowerCase() || headingText.includes(key.toLowerCase())) {
          matched = true;
          console.log(`[parseTourDescription] Matched heading to section: ${sectionKey}`);

          // For services and itinerary, append multiple sub-sections with their headings
          if ((sectionKey === 'services' || sectionKey === 'itinerary') && sections[sectionKey]) {
            sections[sectionKey] += `<h${match[1]}>${match[2]}</h${match[1]}>${content}`;
          } else {
            sections[sectionKey] = `<h${match[1]}>${match[2]}</h${match[1]}>${content}`;
          }
          break;
        }
      }

      // If no match but content exists and has substantial length, put in 'overview' as default ONLY IF OVERVIEW IS EMPTY
      if (!matched && content && content.length > 20 && !sections.overview) {
        console.log('[parseTourDescription] Putting unmatched content in overview');
        sections.overview = `<h${match[1]}>${match[2]}</h${match[1]}>${content}`;
      }
    }

    // If still no sections parsed but we have content, put it all in overview
    if (Object.keys(sections).length === 0 && description.trim().length > 0) {
      console.log('[parseTourDescription] No sections found, putting all content in overview');
      sections.overview = description.trim();
    }

    // FIX 3: Improve the itinerary detection logic - don't overwrite content unnecessarily
    // Also check if there's any itinerary content that might be in wrong section
    const ngayPattern = /<h[2-4][^>]*>\s*(?:ngày|ngay|day)\s*\d+|<(?:h4|strong|b)[^>]*>\s*(?:ngày|ngay|day)\s*\d+/i;
    
    // Check overview for itinerary content
    if (sections.overview && !sections.itinerary && ngayPattern.test(sections.overview)) {
      console.log('[parseTourDescription] Found itinerary content in overview, moving it...');
      const splitIndex = sections.overview.search(ngayPattern);
      if (splitIndex > 0) {
        sections.itinerary = sections.overview.substring(splitIndex).trim();
        sections.overview = sections.overview.substring(0, splitIndex).trim();
      } else {
        sections.itinerary = sections.overview;
        sections.overview = '';
      }
    }
    
    // Check highlights for itinerary content
    if (sections.highlights && !sections.itinerary && ngayPattern.test(sections.highlights)) {
      console.log('[parseTourDescription] Found itinerary content in highlights, moving it...');
      const splitIndex = sections.highlights.search(ngayPattern);
      if (splitIndex > 0) {
        sections.itinerary = sections.highlights.substring(splitIndex).trim();
        sections.highlights = sections.highlights.substring(0, splitIndex).trim();
      } else {
        sections.itinerary = sections.highlights;
        sections.highlights = '';
      }
    }

    // Additional parsing: if no itinerary yet, check full description for standalone "Ngày X:" sections
    if (!sections.itinerary) {
      console.log('[parseTourDescription] Checking for standalone itinerary sections...');
      const standaloneItineraryPattern = /(<h[2-4][^>]*>\s*(?:ngày|ngay|day)\s*\d+[\s\S]*?)(?=<h[2-4]|$)/gi;
      let itineraryMatch;
      let itineraryContent = '';
      while ((itineraryMatch = standaloneItineraryPattern.exec(description)) !== null) {
        itineraryContent += itineraryMatch[1];
      }
      if (itineraryContent) {
        sections.itinerary = itineraryContent.trim();
        console.log('[parseTourDescription] Found standalone itinerary content');
      }
    }
  }

  console.log('[parseTourDescription] Final sections:', Object.keys(sections));
  return sections;
}

// Account Controller Functions
ClientController.showAccount = async function(req, res, next) {
  try {
    const user = await UserModel.findById(req.session.user.id);
    return res.render('client/account', {
      title: 'Thông tin tài khoản',
      user
    });
  } catch (err) {
    next(err);
  }
};

ClientController.updateProfile = async function(req, res, next) {
  try {
    const { fullname, phone } = req.body;
    if (!fullname) {
      req.flash('error', 'Vui lòng nhập họ tên.');
      return res.redirect('/profile');
    }

    await UserModel.updateProfile(req.session.user.id, { fullname, phone });
    
    // Update session user info
    req.session.user.fullname = fullname;
    
    req.flash('success', 'Cập nhật thông tin thành công!');
    return res.redirect('/profile');
  } catch (err) {
    next(err);
  }
};

ClientController.updatePassword = async function(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      req.flash('error', 'Vui lòng nhập đầy đủ thông tin.');
      return res.redirect('/profile');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'Mật khẩu xác nhận không khớp.');
      return res.redirect('/profile');
    }

    if (newPassword.length < 6) {
      req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return res.redirect('/profile');
    }

    // Get current user to check password
    const user = await UserModel.findById(req.session.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    
    if (!match) {
      req.flash('error', 'Mật khẩu hiện tại không đúng.');
      return res.redirect('/profile');
    }

    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(req.session.user.id, hashed);

    req.flash('success', 'Đổi mật khẩu thành công!');
    return res.redirect('/profile');
  } catch (err) {
    next(err);
  }
};

module.exports = ClientController;
