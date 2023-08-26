const Joi = require('joi')

const student_create_schema = Joi.object().keys({
	full_name: Joi.string().required(),
	class: Joi.string().hex().length(24).required(),
	phone_number: Joi.string().required().length(12)
})

const student_update_schema = Joi.object().keys({
	full_name: Joi.string(),
	class: Joi.string().hex().length(24),
	phone_number: Joi.string().length(12)
})

module.exports = { student_create_schema, student_update_schema }