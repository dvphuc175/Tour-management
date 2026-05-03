const TourModel = require('../models/TourModel');
const CategoryModel = require('../models/CategoryModel');
const { cloudinary } = require('../config/cloudinary');
const { makeSlug } = require('../helpers/slug');
const { tourSchema } = require('../validators/tourSchema');
const { query } = require('../config/db');
const LIMIT = 10;

const TourController = {
  // GET /admin/tours
  async index(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * LIMIT;

      const categoryId = req.query.category || null;
      const status = req.query.status || null;

      const [tours, total, categories] = await Promise.all([
        TourModel.getAll({ limit: LIMIT, offset, categoryId, status }),
        TourModel.countAll({ categoryId, status }),
        CategoryModel.getAll()
      ]);

      res.render('admin/tours/index', {
        title: 'Quản lý tour',
        tours,
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / LIMIT),
        query: req.query,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/tours/create
  async showCreate(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();

      res.render('admin/tours/form', {
        title: 'Thêm tour mới',
        tour: null,
        categories,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/tours
  async create(req, res, next) {
    try {
      const { error, value } = tourSchema.validate(req.body);
        if (error) {
            req.flash('error', error.details[0].message);
            return res.redirect('/admin/tours/create'); 
        }
      const {
        name,
        category_id,
        description,
        status,
        price_adult,
        price_child
      } = value;

      const slug = makeSlug(name);

      if (await TourModel.isSlugExists(slug)) {
        req.flash('error', 'Tên tour này đã tồn tại');
        return res.redirect('/admin/tours/create');
      }

      // Lấy URL ảnh từ Cloudinary
      const images = (req.files || []).map(f => f.path);

      await TourModel.create({
        category_id,
        name: name.trim(),
        description,
        status: status || 'active',
        price_adult: parseInt(price_adult),
        price_child: parseInt(price_child),
        images
      });

      req.flash('success', 'Thêm tour thành công');
      return req.session.save(() => {
        res.redirect('/admin/tours');
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/tours/:id/edit
  async showEdit(req, res, next) {
    try {
      const [tour, categories] = await Promise.all([
        TourModel.findById(req.params.id),
        CategoryModel.getAll()
      ]);

      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/admin/tours');
      }

      res.render('admin/tours/form', {
        title: 'Sửa tour',
        tour,
        categories,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /admin/tours/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = tourSchema.validate(req.body);
        if (error) {
            req.flash('error', error.details[0].message);
            return res.redirect(`/admin/tours/${id}/edit`); 
        }
      const {
        name,
        category_id,
        description,
        status,
        price_adult,
        price_child
      } = value;

      const tour = await TourModel.findById(id);

      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/admin/tours');
      }

      const slug = makeSlug(name);

      if (await TourModel.isSlugExists(slug, id)) {
        req.flash('error', 'Tên tour này đã tồn tại');
        return res.redirect(`/admin/tours/${id}/edit`);
      }

      // Giữ ảnh cũ
      let keepImages = req.body.keep_images;
      if (!keepImages) {
          keepImages = []; 
      } else if (!Array.isArray(keepImages)) {
          keepImages = [keepImages]; 
      }

      const newImages = (req.files || []).map(f => f.path);

      if (keepImages.length + newImages.length > 10) {
          for (const url of newImages) {
              const publicId = url.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
              await cloudinary.uploader.destroy(publicId).catch(() => {});
          }
          req.flash('error', `Tổng số ảnh không được vượt quá 10 ảnh! (Hiện đang là ${keepImages.length + newImages.length})`);
          return res.redirect(`/admin/tours/${id}/edit`);
      }

      const imagesToDelete = (tour.images || []).filter(img => !keepImages.includes(img));
      for (const url of imagesToDelete) {
          const publicId = url.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      const images = [...keepImages, ...newImages];

      await TourModel.update(id, {
        category_id,
        name: name.trim(),
        description,
        status,
        price_adult: parseInt(price_adult),
        price_child: parseInt(price_child),
        images
      });

      req.flash('success', 'Cập nhật tour thành công');
      res.redirect('/admin/tours');
    } catch (err) {
      next(err);
    }
  },

  // DELETE /admin/tours/:id
  async delete(req, res, next) {
    try {
      const tourId = req.params.id;

      const result = await query(
        `SELECT b.id FROM BOOKINGS b 
         JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id 
         WHERE s.tour_id = ? LIMIT 1`, 
        [tourId]
      );

      const rows = Array.isArray(result[0]) ? result[0] : result;

      if (rows && rows.length > 0) {
        req.flash('error', 'Không thể xóa Tour này vì đang có khách đặt. Bạn chỉ có thể ẩn nó đi.');
        return res.redirect('/admin/tours');
      }

      await TourModel.delete(tourId);
      req.flash('success', 'Đã xóa tour thành công');
      res.redirect('/admin/tours');

    } catch (err) {
      next(err);
    }
  }
};

module.exports = TourController;