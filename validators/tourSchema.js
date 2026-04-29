const Joi = require('joi');


const tourSchema = Joi.object({
    name: Joi.string().trim().min(5).max(200).required().messages({
        'string.empty': 'Tên tour không được để trống.',
        'string.min': 'Tên tour phải có ít nhất 5 ký tự.',
        'string.max': 'Tên tour không được vượt quá 200 ký tự.',
        'any.required': 'Vui lòng nhập tên tour.'
    }),
    category_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Danh mục không hợp lệ.',
        'any.required': 'Vui lòng chọn danh mục cho tour.'
    }),
    price_adult: Joi.number().integer().min(500000).max(100000000).required().messages({
        'number.max': 'Giá người lớn quá lớn, vui lòng kiểm tra lại.',
        'number.base': 'Giá người lớn phải là một số.',
        'number.min': 'Giá vé người lớn phải từ 500.000đ trở lên.',
        'any.required': 'Vui lòng nhập giá người lớn.'
    }),
    price_child: Joi.number().integer().min(0).max(100000000).required().messages({
        'number.min': 'Giá trẻ em không được là số âm.',
        'number.max': 'Giá trẻ em quá lớn, vui lòng kiểm tra lại.',
        'number.base': 'Giá trẻ em phải là một số.',
        'any.required': 'Vui lòng nhập giá trẻ em.'
    }),
    description: Joi.string().trim().max(5000).required().messages({
        'any.required': 'Vui lòng nhập mô tả.',
        'string.empty': 'Mô tả không được để trống.',
        'string.max': 'Mô tả không được vượt quá 5000 ký tự.'
    }),
    status: Joi.string().valid('active', 'hidden').default('active'),

    keep_images: Joi.any() 
});

const today = new Date();
today.setHours(0, 0, 0, 0);
const scheduleSchema = Joi.object({
    departure_location: Joi.string().trim().min(2).max(30).required().messages({
        'string.empty': 'Điểm khởi hành không được để trống.',
        'string.min': 'Điểm khởi hành phải từ 2 ký tự trở lên.',
        'string.max': 'Điểm khởi hành không được vượt quá 30 ký tự.'
    }),
    start_date: Joi.date().min(today).required().messages({
        'date.min': 'Ngày khởi hành không được nằm trong quá khứ.',
        'any.required': 'Vui lòng chọn ngày khởi hành.'
    }),
    end_date: Joi.date().min(Joi.ref('start_date')).required().messages({
        'date.min': 'Ngày kết thúc phải diễn ra sau hoặc cùng ngày khởi hành.',
        'any.required': 'Vui lòng chọn ngày kết thúc.'
    }),
    total_slots: Joi.number().integer().min(1).max(100).required().messages({
        'number.min': 'Tổng số chỗ phải lớn hơn 0.',
        'number.max': 'Một lịch trình không được vượt quá 100 chỗ.',
        'number.base': 'Tổng số chỗ phải là một số.',
        'any.required': 'Vui lòng nhập tổng số chỗ.'
    }),
    status: Joi.string().valid('auto', 'cancelled').optional().messages({
        'any.only': 'Trạng thái truyền lên không hợp lệ.'
    })
});

module.exports = { tourSchema, scheduleSchema };