class TourController {
    async index(req, res) {
        res.render('admin/tours/index', { 
            title: 'Quản lý tour', 
            tours: [], 
            categories: [],
            query: {} 
        });
    }

    async showCreate(req, res) {
        res.render('admin/tours/form', { 
            title: 'Thêm tour mới', 
            tour: null, 
            categories: [] 
        });
    }

    async showEdit(req, res) {
        res.render('admin/tours/form', { 
            title: 'Chỉnh sửa tour', 
            tour: { name: 'Tour mẫu' }, 
            categories: [] 
        });
    }
}

module.exports = new TourController();