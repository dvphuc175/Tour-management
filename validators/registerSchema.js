const Joi = require('joi');

const registerSchema = Joi.object({
  fullname: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-zÀ-ỹ\s]+$/)
    .required()
    .messages({
      'string.empty': 'Họ tên không được để trống',
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên tối đa 50 ký tự',
      'string.pattern.base': 'Họ tên chỉ được chứa chữ và khoảng trắng'
    }),

  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'string.max': 'Email tối đa 100 ký tự',
      'string.empty': 'Email không được để trống'
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mật khẩu phải 8-16 ký tự, gồm ít nhất chữ và số'
    }),

  confirmPassword: Joi.valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp'
    }),

  phone: Joi.string()
    .pattern(/^0\d{9}$/)
    .allow('', null) 
    .messages({
      'string.pattern.base': 'Số điện thoại phải 10 số và bắt đầu bằng 0'
    })
});

module.exports = registerSchema;