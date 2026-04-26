const ScheduleModel = require('../models/ScheduleModel');
const TourModel = require('../models/TourModel');
const { scheduleSchema } = require('../validators/tourSchema');
const ScheduleController = {
  // GET /admin/tours/:tourId/schedules
  async index(req, res, next) {
    try {
      const { tourId } = req.params;

      const [tour, schedules] = await Promise.all([
        TourModel.findById(tourId),
        ScheduleModel.getByTourId(tourId)
      ]);

      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/admin/tours');
      }

      res.render('admin/schedules/index', {
        title: `Lịch trình: ${tour.name}`,
        tour,
        schedules,
        today: new Date(),
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/tours/:tourId/schedules/create
  async showCreate(req, res, next) {
    try {
      const tour = await TourModel.findById(req.params.tourId);

      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/admin/tours');
      }

      res.render('admin/schedules/form', {
        title: 'Thêm lịch trình',
        tour,
        schedule: null,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /admin/tours/:tourId/schedules
  async create(req, res, next) {
    try {
      const { tourId } = req.params;
      const { error, value } = scheduleSchema.validate(req.body);
      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect(`/admin/tours/${tourId}/schedules/create`);
      }

      const { departure_location, start_date, end_date, total_slots } = value;

      const isDuplicate = await ScheduleModel.checkDuplicate(
        tourId, 
        departure_location, 
        start_date, 
        end_date
      );

      if (isDuplicate) {
        req.flash('error', 'Lịch trình này đã tồn tại! Vui lòng kiểm tra lại ngày và điểm khởi hành.');
        return res.redirect(`/admin/tours/${tourId}/schedules/create`);
      }

      await ScheduleModel.create({
        tour_id: tourId, 
        departure_location,
        start_date, 
        end_date,
        total_slots: parseInt(total_slots)
      });
      
      req.flash('success', 'Thêm lịch trình thành công');
      res.redirect(`/admin/tours/${tourId}/schedules`);
      
    } catch (err) { 
      next(err); 
    }
  },

  // GET /admin/schedules/:id/edit
  async showEdit(req, res, next) {
    try {
      const schedule = await ScheduleModel.findById(req.params.id);

      if (!schedule) {
        req.flash('error', 'Không tìm thấy lịch trình');
        return res.redirect('/admin/tours');
      }

      const tour = await TourModel.findById(schedule.tour_id);

      res.render('admin/schedules/form', {
        title: 'Sửa lịch trình',
        tour,
        schedule,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /admin/schedules/:id
  async update(req, res, next) {
    try {
      const id = req.params.id; 

      const schedule = await ScheduleModel.findById(id); 
      if (!schedule) { 
        req.flash('error', 'Không tìm thấy lịch trình'); 
        return res.redirect('/admin/tours'); 
      }

      const { error, value } = scheduleSchema.validate(req.body);
      if (error) {
          req.flash('error', error.details[0].message);
          return res.redirect(`/admin/schedules/${id}/edit`);
      }
      const { departure_location, start_date, end_date, total_slots, status } = value;

      const isDuplicate = await ScheduleModel.checkDuplicate(
        schedule.tour_id, 
        departure_location, 
        start_date, 
        end_date,
        id 
      );

      if (isDuplicate) {
        req.flash('error', 'Cập nhật thất bại! Thông tin ngày và địa điểm này trùng với một lịch trình khác đã tồn tại.');
        return res.redirect(`/admin/schedules/${id}/edit`);
      }

      const newTotalSlots = parseInt(total_slots);
      const bookedSlots = schedule.total_slots - schedule.available_slots;
      const newAvailableSlots = newTotalSlots - bookedSlots;
      
      if (newAvailableSlots < 0) {
        req.flash('error', `Lỗi: Đã có ${bookedSlots} khách đặt vé. Không thể giảm tổng số chỗ xuống ${newTotalSlots}.`);
        return res.redirect(`/admin/schedules/${id}/edit`);
      }

      let finalStatus;
      if (status === 'cancelled') {
        finalStatus = 'cancelled'; 
      } else {
        finalStatus = (newAvailableSlots > 0) ? 'active' : 'full';
      }

      await ScheduleModel.update(id, { 
        departure_location, 
        start_date, 
        end_date,
        total_slots: newTotalSlots,
        available_slots: newAvailableSlots, 
        status: finalStatus                 
      });

      req.flash('success', 'Cập nhật lịch trình thành công');
      res.redirect(`/admin/tours/${schedule.tour_id}/schedules`);
      
    } catch (err) { 
      next(err); 
    }
  },

  // DELETE /admin/schedules/:id
  async delete(req, res, next) {
    try {
      const schedule = await ScheduleModel.findById(req.params.id);

      if (schedule) {
        await ScheduleModel.delete(req.params.id); // có thể throw nếu đã có booking

        req.flash('success', 'Đã xóa lịch trình');
        return res.redirect(`/admin/tours/${schedule.tour_id}/schedules`);
      }

      req.flash('error', 'Không tìm thấy lịch trình');
      res.redirect('/admin/tours');
    } catch (err) {
      req.flash('error', err.message); // ví dụ: "Không thể xóa lịch trình đã có đặt chỗ"
      res.redirect('back');
    }
  }
};

module.exports = ScheduleController;