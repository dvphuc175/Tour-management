const TourModel = require('../models/TourModel');
const CategoryModel = require('../models/CategoryModel');
const ScheduleModel = require('../models/ScheduleModel');

const LIMIT = 9; 

const ClientController = {
  // GET /
  async home(req, res, next) {
    try {
      const [featuredTours, categories] = await Promise.all([
        TourModel.getFeatured(6),
        CategoryModel.getActive()
      ]);

      return res.render('client/home', {
        title: 'Trang chủ',
        featuredTours,
        categories
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

      return res.render('client/tour-detail', {
        title: tour.name,
        tour,
        schedules
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ClientController;