const CategoryModel = require('../models/CategoryModel');
const { makeSlug }   = require('../helpers/slug');
const categorySchema = require('../validators/categorySchema');
const CategoryController = {
  // GET /admin/categories
  async index(req, res, next) {
    try {
      
      const page = parseInt(req.query.page) || 1;
      const limit = 5; 
      const offset = (page - 1) * limit;

      const totalCategories = await CategoryModel.totalCategory();
      const totalPages = Math.ceil(totalCategories / limit);
      const categories = await CategoryModel.pageCategory(limit, offset);
      
      res.render('admin/categories/index', {
        title: 'Quản lý danh mục', categories,
        currentPage: page,
        totalPages: totalPages
      });
    } catch (err) { next(err); }
  },

  // GET /admin/categories/create
  showCreate(req, res) {
    res.render('admin/categories/form', {
      title: 'Thêm danh mục', category: null,
      currentPath: req.path
    });
  },

  // POST /admin/categories
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const { error } = categorySchema.validate(req.body);

      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/admin/categories/create');
      }
      const slug = makeSlug(name);
      const exists = await CategoryModel.isSlugExists(slug);
      if (exists) {
        req.flash('error', 'Tên danh mục này đã tồn tại');
        return res.redirect('/admin/categories/create');
      }
      await CategoryModel.create({ name: name.trim(), description });
      req.flash('success', 'Thêm danh mục thành công');
      req.session.save(() => {
        res.redirect('/admin/categories');
      });
    } catch (err) { next(err); }
  },

  // GET /admin/categories/:id/edit
  async showEdit(req, res, next) {
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) { 
        req.flash('error', 'Không tìm thấy danh mục'); 
        return res.redirect('/admin/categories'); 
      }
      res.render('admin/categories/form', {
        title: 'Sửa danh mục', category,
        currentPath: req.path
      });
    } catch (err) { next(err); }
  },

  // PUT /admin/categories/:id  
  async update(req, res, next) {
    try {
      const { name, description, status } = req.body;
      const { id } = req.params;
      const { error } = categorySchema.validate(req.body);

      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect(`/admin/categories/${id}/edit`);
      }
      const slug   = makeSlug(name);
      const exists = await CategoryModel.isSlugExists(slug, id);
      if (exists) {
        req.flash('error', 'Tên danh mục này đã tồn tại');
        return res.redirect(`/admin/categories/${id}/edit`);
      }
      await CategoryModel.update(id, { name: name.trim(), description, status });
        req.flash('success', 'Cập nhật danh mục thành công');
        return req.session.save(() => {
          res.redirect('/admin/categories');
      });
    } catch (err) { next(err); }
  },

  // DELETE /admin/categories/:id  (method-override)
  async delete(req, res, next) {
    try {
      const categoryId = req.params.id;
      const hasTours = await CategoryModel.checkHasTours(categoryId);
      if (hasTours) {
        req.flash('error', 'Không thể xóa! Danh mục này đang chứa các tour du lịch.');
        return req.session.save(() => {
          res.redirect('/admin/categories');
        });
      }
      await CategoryModel.delete(categoryId);
      req.flash('success', 'Đã xóa danh mục thành công!');
      req.session.save(() => {
        res.redirect('/admin/categories');
      });
      
    } catch (err) { 
      next(err); 
    }
  }
};

module.exports = CategoryController;