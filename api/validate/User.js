import Joi from 'joi';

export const signUpValidate = Joi.object({
  userName: Joi.string().min(6).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string(),
});
export const signInValidate = Joi.object({
 
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
  
  });
