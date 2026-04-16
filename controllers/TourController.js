const TourModel = require('../models/TourModel');
const CategoryModel = require('../models/CategoryModel');
const { cloudinary } = require('../config/cloudinary');
const { makeSlug } = require('../helpers/slug');
const { tourSchema } = require('../validators/tourSchema');
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
      res.redirect('/admin/tours');
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

      const imagesToDelete = (tour.images || []).filter(img => !keepImages.includes(img));
      
      for (const url of imagesToDelete) {
          const publicId = url.split('/').slice(-2).join('/').replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId).catch(() => {});
      }

      const newImages = (req.files || []).map(f => f.path);
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
      const tour = await TourModel.findById(req.params.id);

      if (tour) {
        // Xóa ảnh trên Cloudinary
        for (const url of (tour.images || [])) {
          const publicId = url
            .split('/')
            .slice(-2)
            .join('/')
            .replace(/\.[^/.]+$/, '');

          await cloudinary.uploader.destroy(publicId).catch(() => {});
        }

        await TourModel.delete(req.params.id);
      }

      req.flash('success', 'Đã xóa tour');
      res.redirect('/admin/tours');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = TourController;