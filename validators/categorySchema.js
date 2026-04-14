const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Tên danh mục không được để trống',
      'string.min': 'Tên danh mục phải từ 3-30 ký tự',
      'string.max': 'Tên danh mục phải từ 3-30 ký tự'
    }),

  description: Joi.string()
    .allow('', null)
    .max(50)
    .messages({
      'string.max': 'Mô tả vượt quá 50 ký tự'
    }),

  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
});
module.exports = categorySchema;