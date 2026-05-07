const TourModel = require('../models/TourModel');
const CategoryModel = require('../models/CategoryModel');
const ScheduleModel = require('../models/ScheduleModel');

const LIMIT = 8; 
const HOME_LIMIT = 6; // 6 tours per page on homepage

const ClientController = {
  // GET /
  async home(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const offset = (page - 1) * HOME_LIMIT;

      const [tours, total, categories] = await Promise.all([
        TourModel.getPublic({ limit: HOME_LIMIT, offset }),
        TourModel.countPublic({}),
        CategoryModel.getActive()
      ]);

      return res.render('client/home', {
        title: 'Trang chủ',
        tours,
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

      // Lấy lịch trình còn active, chưa qua ngày hôm nay
      const schedules = await ScheduleModel.getAvailableByTourId(tour.id);

      // Parse description into sections
      const sections = parseTourDescription(tour.description);

      return res.render('client/tour-detail', {
        title: tour.name,
        tour,
        schedules,
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
  // More flexible regex: handles extra whitespace, different comment formats
  const sectionRegex = /<!--\s*SECTION:\s*(\w+)\s*-->([\s\S]*?)(?=<!--\s*(?:SECTION:\s*\w+|ENDSECTION)\s*-->|$)/gi;
  let hasMarkers = false;
  let match;

  while ((match = sectionRegex.exec(description)) !== null) {
    hasMarkers = true;
    const sectionName = match[1].toLowerCase().trim();
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  // If no markers found, parse from HTML headings (h2, h3, h4)
  if (!hasMarkers) {
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
    const headingRegex = /<h[2-4][^>]*>(.*?)<\/h[2-4]>([\s\S]*?)(?=<h[2-4]|$)/gi;

    while ((match = headingRegex.exec(description)) !== null) {
      const headingText = match[1].replace(/<[^>]*>/g, '').trim().toLowerCase();
      const content = match[2].trim();
      let matched = false;

      // Find matching section key
      for (const [key, sectionKey] of Object.entries(headingMap)) {
        if (headingText.includes(key.toLowerCase())) {
          matched = true;

          // For services and itinerary, append multiple sub-sections
          if ((sectionKey === 'services' || sectionKey === 'itinerary') && sections[sectionKey]) {
            sections[sectionKey] += match[1] + content;
          } else {
            sections[sectionKey] = content;
          }
          break;
        }
      }

      // If no match but content exists and has substantial length, put in 'overview' as default
      if (!matched && content && content.length > 20 && !sections.overview) {
        sections.overview = match[1] + content;
      }
    }

    // If still no sections parsed but we have content, put it all in overview
    if (Object.keys(sections).length === 0 && description.trim().length > 0) {
      sections.overview = description.trim();
    }

    // Also check if there's any itinerary content in the highlights section
    // that should be moved to itinerary
    // Pattern matches: <h3>Ngày 1:, <h4>Ngày 1:, <strong>Ngày 1:, or plain text "Ngày 1:"
    if (sections.highlights && !sections.itinerary) {
      const ngayPattern = /<h[3-4][^>]*>\s*(?:ngày|ngay|day)\s*\d+|<(?:h4|strong|b)[^>]*>\s*(?:ngày|ngay|day)\s*\d+/i;
      if (ngayPattern.test(sections.highlights)) {
        sections.itinerary = sections.highlights;
        // Keep only the content before Ngày in highlights
        const splitIndex = sections.highlights.search(/<h[3-4][^>]*>\s*(?:ngày|ngay|day)\s*\d+|<(?:h4|strong|b)[^>]*>\s*(?:ngày|ngay|day)\s*\d+/i);
        if (splitIndex > 0) {
          sections.highlights = sections.highlights.substring(0, splitIndex).trim();
        } else {
          sections.highlights = '';
        }
      }
    }

    // Additional parsing: if no itinerary yet, check full description for standalone "Ngày X:" sections
    if (!sections.itinerary) {
      const standaloneItineraryPattern = /(<h[2-4][^>]*>\s*(?:ngày|ngay|day)\s*\d+[\s\S]*?)(?=<h[2-4]|$)/gi;
      let itineraryMatch;
      let itineraryContent = '';
      while ((itineraryMatch = standaloneItineraryPattern.exec(description)) !== null) {
        itineraryContent += itineraryMatch[1];
      }
      if (itineraryContent) {
        sections.itinerary = itineraryContent.trim();
      }
    }
  }

  return sections;
}

module.exports = ClientController;