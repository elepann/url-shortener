const Joi = require('joi');

const urlValidation = Joi.object({
    originalUrl: Joi.string().required() //validasi empty string
})

module.exports = urlValidation