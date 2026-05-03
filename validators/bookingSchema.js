const Joi = require('joi');

const bookingSchema = Joi.object({
  schedule_id: Joi.number().required(),
  
  contact_name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Vui lòng nhập họ và tên liên hệ.',
    'string.max': 'Họ và tên không được vượt quá 100 ký tự.',
    'any.required': 'Họ và tên là bắt buộc.'
  }),
  
  contact_phone: Joi.string().trim().pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/).max(15).required().messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ. Vui lòng nhập SĐT Việt Nam.',
    'string.max': 'Số điện thoại không được vượt quá 15 ký tự.',
    'string.empty': 'Vui lòng nhập số điện thoại.'
  }),
  
  contact_email: Joi.string().trim().email().max(255).required().messages({
    'string.email': 'Định dạng email không hợp lệ.',
    'string.max': 'Email không được vượt quá 255 ký tự.',
    'string.empty': 'Vui lòng nhập email.'
  }),
  
  adult_count: Joi.number().integer().min(1).max(50).required().messages({
    'number.base': 'Số lượng người lớn phải là một con số.',
    'number.min': 'Phải có ít nhất 1 người lớn trong đơn đặt tour.',
    'number.max': 'Không thể đặt quá 50 vé người lớn cho một đơn.'
  }),
  
  child_count: Joi.number().integer().min(0).max(50).empty('').default(0).messages({
    'number.max': 'Không thể đặt quá 50 vé trẻ em cho một đơn.'
  }),
  
  special_request: Joi.string().trim().max(500).allow('', null).optional().messages({
    'string.max': 'Yêu cầu đặc biệt quá dài. Vui lòng tóm tắt dưới 500 ký tự.'
  }),
  
  payment_method: Joi.string().valid('vnpay', 'cash').default('cash')
});

module.exports = { bookingSchema };