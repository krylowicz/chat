const joi = require('@hapi/joi');

const authValidation = body => {
  const authValidationSchema = joi.object({
    name: joi.string().min(4).required(),
    password: joi.string().min(8).required(),
  });
  return authValidationSchema.validate(body);
};

module.exports = authValidation;
