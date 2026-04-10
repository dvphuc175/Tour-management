const { query }   = require('../config/db');
const { makeSlug } = require('../helpers/slug');

const CategoryModel = {
  async getAll() {
    return query('SELECT * FROM CATEGORIES ORDER BY name ASC');
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

  async delete(id) {
    // Khi xóa, tours thuộc category này sẽ có category_id = NULL (ON DELETE SET NULL)
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