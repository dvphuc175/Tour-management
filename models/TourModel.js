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
// Public: lấy tour active có filter + search + phân trang
async function getPublic({
  limit = 9,
  offset = 0,
  categoryId = null,
  search = null,
  minPrice = null,
  maxPrice = null
} = {}) {
  let sql = `
    SELECT 
      t.id,
      t.name,
      t.slug,
      t.description,
      t.price_adult,
      t.price_child,
      t.images,
      c.name AS category_name,
      MIN(s.start_date) AS next_departure,
      SUM(s.available_slots) AS total_available
    FROM TOURS t
    LEFT JOIN CATEGORIES c 
      ON t.category_id = c.id
    LEFT JOIN TOUR_SCHEDULES s 
      ON s.tour_id = t.id
      AND s.status = 'active'
      AND s.start_date >= CURDATE()
    WHERE t.status = 'active'
  `;

  const params = [];

  if (categoryId) {
    sql += ` AND t.category_id = ?`;
    params.push(categoryId);
  }

  if (search) {
    sql += ` AND t.name LIKE ?`;
    params.push(`%${search}%`);
  }

  if (minPrice !== null) {
  sql += ` AND t.price_adult >= ?`;
  params.push(Number(minPrice));
}

  if (maxPrice !== null) {
  sql += ` AND t.price_adult <= ?`;
  params.push(Number(maxPrice));
}

  sql += `
  GROUP BY t.id
  ORDER BY t.created_at DESC
  LIMIT ${Number(limit)} OFFSET ${Number(offset)}
`;
  const rows = await query(sql, params);
  return rows.map(parseTour);
}


// Đếm tổng số tour public (phục vụ phân trang)
async function countPublic({
  categoryId = null,
  search = null,
  minPrice = null,
  maxPrice = null
} = {}) {
  let sql = `
    SELECT COUNT(*) AS total
    FROM TOURS t
    WHERE t.status = 'active'
  `;

  const params = [];

  if (categoryId) {
    sql += ` AND t.category_id = ?`;
    params.push(categoryId);
  }

  if (search) {
    sql += ` AND t.name LIKE ?`;
    params.push(`%${search}%`);
  }

  if (minPrice !== null) {
  sql += ` AND t.price_adult >= ?`;
  params.push(Number(minPrice));
}

  if (maxPrice !== null) {
  sql += ` AND t.price_adult <= ?`;
  params.push(Number(maxPrice));
}

  const rows = await query(sql, params);
  return rows[0].total;
}


// Public: lấy tour nổi bật cho trang chủ
async function getFeatured(limit = 6) {
  const sql = `
    SELECT
      t.id,
      t.name,
      t.slug,
      t.price_adult,
      t.images,
      c.name AS category_name,
      MIN(s.start_date) AS next_departure,
      SUM(s.available_slots) AS total_available
    FROM TOURS t
    LEFT JOIN CATEGORIES c
      ON t.category_id = c.id
    LEFT JOIN TOUR_SCHEDULES s
      ON s.tour_id = t.id
      AND s.status = 'active'
      AND s.start_date >= CURDATE()
    WHERE t.status = 'active'
    GROUP BY t.id
    ORDER BY t.created_at DESC
    LIMIT ${Number(limit)}
  `;

  const rows = await query(sql);
  return rows.map(parseTour);
}
TourModel.getPublic = getPublic;
TourModel.countPublic = countPublic;
TourModel.getFeatured = getFeatured;
module.exports = TourModel;