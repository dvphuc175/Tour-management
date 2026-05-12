const { query } = require('../config/db');

const ReportModel = {
  async getSummary() {
    const [bookings, revenue, users, tours] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) AS total,
          SUM(status = 'pending') AS pending,
          SUM(status = 'confirmed') AS confirmed,
          SUM(status = 'completed') AS completed,
          SUM(status = 'cancelled') AS cancelled
        FROM BOOKINGS
      `),

      query(`
        SELECT 
          COALESCE(SUM(p.amount), 0) AS total_revenue
        FROM PAYMENTS p
        WHERE p.status = 'success'
      `),

      query(`
        SELECT 
          COUNT(*) AS total,
          SUM(status = 'active') AS active,
          SUM(status = 'locked') AS locked
        FROM USERS
        WHERE role = 'customer'
      `),

      query(`
        SELECT 
          COUNT(*) AS total,
          SUM(status = 'active') AS active
        FROM TOURS
      `)
    ]);

    return {
      bookings: bookings[0],
      revenue: revenue[0].total_revenue,
      users: users[0],
      tours: tours[0]
    };
  },

  async getRevenueByMonth(year) {
    return query(
      `
      SELECT 
        MONTH(p.paid_at) AS month,
        COALESCE(SUM(p.amount), 0) AS revenue,
        COUNT(DISTINCT b.id) AS bookings
      FROM PAYMENTS p
      JOIN BOOKINGS b 
        ON p.booking_id = b.id
      WHERE 
        p.status = 'success'
        AND YEAR(p.paid_at) = ?
      GROUP BY MONTH(p.paid_at)
      ORDER BY month ASC
      `,
      [year]
    );
  },

  async getTopTours(limit = 5) {
    const safeLimit = parseInt(limit) || 5;
    return query(
      `
      SELECT 
        t.id,
        t.name,
        t.slug,
        COUNT(b.id) AS total_bookings,
        SUM(b.total_price) AS total_revenue
      FROM BOOKINGS b
      JOIN TOUR_SCHEDULES s 
        ON b.schedule_id = s.id
      JOIN TOURS t 
        ON s.tour_id = t.id
      WHERE b.status IN ('confirmed', 'completed')
      GROUP BY t.id, t.name, t.slug
      ORDER BY total_bookings DESC
      LIMIT ${safeLimit}
      `
    );
  },

  async getRevenueByRange(from, to) {
    return query(
      `
      SELECT 
        DATE(p.paid_at) AS date,
        COUNT(b.id) AS bookings,
        SUM(p.amount) AS revenue,
        SUM(b.adult_count + b.child_count) AS passengers
      FROM PAYMENTS p
      JOIN BOOKINGS b 
        ON p.booking_id = b.id
      WHERE 
        p.status = 'success'
        AND p.paid_at BETWEEN ? AND ?
      GROUP BY DATE(p.paid_at)
      ORDER BY date ASC
      `,
      [from, `${to} 23:59:59`]
    );
  }
};

module.exports = ReportModel;