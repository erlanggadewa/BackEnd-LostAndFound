import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Global Prefix
  PREFIX_NAME: Joi.string().required(),

  // Database
  DATABASE_URL: Joi.string().required(),
  SHADOW_DATABASE_URL: Joi.string().optional(),

  // JWT SECRET KEY
  JWT_SECRET: Joi.string().required(),

  // Nodemailer settings
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
});
