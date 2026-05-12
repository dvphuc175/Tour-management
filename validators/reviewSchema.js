const Joi = require('joi');
 
const reviewSchema = Joi.object({
  tour_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Tour không hợp lệ.',
    'any.required': 'Thiếu thông tin tour.'
  }),
 
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Vui lòng chọn số sao.',
    'number.integer': 'Số sao phải là số nguyên.',
    'number.min': 'Số sao tối thiểu là 1.',
    'number.max': 'Số sao tối đa là 5.',
    'any.required': 'Vui lòng chọn số sao.'
  }),
 
  comment: Joi.string().trim().min(10).max(1000).required().messages({
    'string.empty': 'Vui lòng nhập nội dung đánh giá.',
    'string.min': 'Nội dung đánh giá tối thiểu 10 ký tự.',
    'string.max': 'Nội dung đánh giá tối đa 1000 ký tự.',
    'any.required': 'Vui lòng nhập nội dung đánh giá.'
  }),
 
  _csrf: Joi.any().strip()
});
 
module.exports = { reviewSchema };