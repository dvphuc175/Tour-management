const { query } = require('../config/db');
const { makeSlug } = require('../helpers/slug');

// Helper: parse cột images (TEXT lưu JSON) → array
function parseTour(tour) {
  if (!tour) return null;

  try {
    tour.images = tour.images ? JSON.parse(tour.images) : [];
  } catch (err) {
    tour.images = [];
  }

  return tour;
}

const TourModel = {
  async getAll({ limit = 20, offset = 0, categoryId = null, status = null } = {}) {
    let sql = `
      SELECT t.*, c.name AS category_name
      FROM TOURS t
      LEFT JOIN CATEGORIES c ON t.category_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (categoryId) {
      sql += ' AND t.category_id = ?';
      params.push(categoryId);
    }

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    sql += ` ORDER BY t.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query(sql, params);
    return rows.map(parseTour);
  },

  async countAll({ categoryId = null, status = null } = {}) {
    let sql = 'SELECT COUNT(*) AS total FROM TOURS WHERE 1=1';
    const params = [];

    if (categoryId) {
      sql += ' AND category_id = ?';
      params.push(categoryId);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    const rows = await query(sql, params);
    return rows[0].total;
  },

  async findById(id) {
    const rows = await query(
      `SELECT t.*, c.name AS category_name
       FROM TOURS t
       LEFT JOIN CATEGORIES c ON t.category_id = c.id
       WHERE t.id = ?
       LIMIT 1`,
      [id]
    );

    return parseTour(rows[0] || null);
  },

  async findBySlug(slug) {
    const rows = await query(
      `SELECT t.*, c.name AS category_name
       FROM TOURS t
       LEFT JOIN CATEGORIES c ON t.category_id = c.id
       WHERE t.slug = ? AND t.status = 'active'
       LIMIT 1`,
      [slug]
    );

    return parseTour(rows[0] || null);
  },

  async create({
    category_id,
    name,
    description,
    status,
    price_adult,
    price_child,
    images
  }) {
    const slug = makeSlug(name);

    const result = await query(
      `INSERT INTO TOURS 
       (category_id, name, slug, description, status, price_adult, price_child, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id || null,
        name,
        slug,
        description || null,
        status || 'active',
        price_adult,
        price_child,
        JSON.stringify(images || [])
      ]
    );

    return result.insertId;
  },

  async update(
    id,
    {
      category_id,
      name,
      description,
      status,
      price_adult,
      price_child,
      images
    }
  ) {
    const slug = makeSlug(name);

    return query(
      `UPDATE TOURS SET
        category_id = ?,
        name = ?,
        slug = ?,
        description = ?,
        status = ?,
        price_adult = ?,
        price_child = ?,
        images = ?
       WHERE id = ?`,
      [
        category_id || null,
        name,
        slug,
        description || null,
        status,
        price_adult,
        price_child,
        JSON.stringify(images || []),
        id
      ]
    );
  },

  async delete(id) {
    return query('DELETE FROM TOURS WHERE id = ?', [id]);
  },

  async isSlugExists(slug, excludeId = null) {
    let sql = 'SELECT id FROM TOURS WHERE slug = ?';
    const params = [slug];

    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }

    sql += ' LIMIT 1';

    const rows = await query(sql, params);
    return rows.length > 0;
  }
};

module.exports = TourModel;