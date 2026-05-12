const ReportModel = require('../models/ReportModel');

const AdminDashboardController = {
  // GET /admin
  // Dashboard

  async index(req, res, next) {
    try {
      const currentYear = new Date().getFullYear();

      const [summary, monthlyRevenue, topTours] = await Promise.all([
        ReportModel.getSummary(),
        ReportModel.getRevenueByMonth(currentYear),
        ReportModel.getTopTours(5)
      ]);

      const chartLabels = [
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
        'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
      ];

      const revenueMap = Object.fromEntries(
        monthlyRevenue.map((r) => [r.month, r.revenue])
      );

      const chartRevenue = Array.from(
        { length: 12 },
        (_, i) => revenueMap[i + 1] || 0
      );

      res.render('admin/dashboard', {
        title: 'Dashboard',
        currentPath: '/admin',
        summary,
        topTours,
        currentYear,

        chartData: JSON.stringify({
          labels: chartLabels,
          revenue: chartRevenue
        })
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/reports

  async reports(req, res, next) {
    try {
      const now = new Date();
      const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

      const from = DATE_RE.test(req.query.from)
        ? req.query.from
        : `${now.getFullYear()}-01-01`;

      const to = DATE_RE.test(req.query.to)
        ? req.query.to
        : now.toISOString().slice(0, 10);

      const rows = await ReportModel.getRevenueByRange(from, to);

      const totals = rows.reduce(
        (acc, r) => ({
          revenue: acc.revenue + Number(r.revenue),
          bookings: acc.bookings + Number(r.bookings),
          passengers: acc.passengers + Number(r.passengers)
        }),
        {
          revenue: 0,
          bookings: 0,
          passengers: 0
        }
      );

      const chartData = JSON.stringify({
        labels: rows.map((r) => r.date),
        revenue: rows.map((r) => Number(r.revenue)),
        bookings: rows.map((r) => Number(r.bookings))
      });

      res.render('admin/reports', {
        title: 'Báo cáo doanh thu',
        currentPath: '/admin/reports',

        rows,
        totals,
        from,
        to,
        chartData
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminDashboardController;