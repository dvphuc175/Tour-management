class ScheduleController {
    async index(req, res) {
        res.render('admin/schedules/index', { 
            title: 'Danh sách lịch trình',
            tour: { name: 'Tour mẫu' }, // Dữ liệu giả cho Dev 2
            schedules: [] 
        });
    }

    async showCreate(req, res) {
        res.render('admin/schedules/form', { 
            title: 'Thêm lịch trình',
            tour: { id: req.params.tourId, name: 'Tour mẫu' },
            schedule: null
        });
    }

    async showEdit(req, res) {
        res.render('admin/schedules/form', { 
            title: 'Sửa lịch trình',
            tour: { name: 'Tour mẫu' },
            schedule: { departure_location: 'Hà Nội' } // Dữ liệu giả
        });
    }
}

module.exports = new ScheduleController();