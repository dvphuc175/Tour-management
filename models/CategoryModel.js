const { query }   = require('../config/db');
const { makeSlug } = require('../helpers/slug');

const CategoryModel = {
  async getAll() {
    return query('SELECT * FROM CATEGORIES ORDER BY name ASC');
  },

  async totalCategory() {
    const result = await query('SELECT COUNT(*) as total FROM CATEGORIES');
    return result[0].total;
  },

  async pageCategory(limit, offset) {
    return query(`SELECT * FROM CATEGORIES ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);
  },

  async getActive() {
    return query("SELECT * FROM CATEGORIES WHERE status = 'active' ORDER BY name ASC");
  },

  async findById(id) {
    const rows = await query('SELECT * FROM CATEGORIES WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ name, description }) {
    const slug   = makeSlug(name);
    const result = await query(
      'INSERT INTO CATEGORIES (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || null]
    );
    return result.insertId;
  },

  async update(id, { name, description, status }) {
    const slug = makeSlug(name);
    return query(
      'UPDATE CATEGORIES SET name = ?, slug = ?, description = ?, status = ? WHERE id = ?',
      [name, slug, description || null, status, id]
    );
  },
  
  async checkHasTours(categoryId) {
    const rows = await query('SELECT COUNT(*) AS total FROM TOURS WHERE category_id = ?', [categoryId]);
    return rows[0].total > 0; 
  },

  async delete(id) {
    return query('DELETE FROM CATEGORIES WHERE id = ?', [id]);
  },

  async isSlugExists(slug, excludeId = null) {
    const sql = excludeId
      ? 'SELECT id FROM CATEGORIES WHERE slug = ? AND id != ? LIMIT 1'
      : 'SELECT id FROM CATEGORIES WHERE slug = ? LIMIT 1';
    const params = excludeId ? [slug, excludeId] : [slug];
    const rows = await query(sql, params);
    return rows.length > 0;
  }
};

module.exports = CategoryModel;