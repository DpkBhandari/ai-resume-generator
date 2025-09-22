import Joi from "joi";

// ✅ Register Validator
export const registerValidator = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Name should be a text",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be at most 30 characters",
      "any.required": "Name is required",
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "org", "hotmail", "yahoo"] },
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .alphanum()
    .min(6)
    .max(64)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,64}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain only letters and numbers (6-64 chars)",
      "any.required": "Password is required",
    }),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match password",
    "any.required": "Confirm password is required",
  }),
}).options({ allowUnknown: false }, { stripUnknown: true });

// ✅ Login Validator
export const loginValidator = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "org", "hotmail", "yahoo"] },
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
  password: Joi.string().alphanum().min(6).max(64).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be at most 64 characters",
    "any.required": "Password is required",
  }),
}).options({ allowUnknown: false }, { stripUnknown: true });

// Forgot Password

export const forgotPasswordValidator = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "org", "hotmail", "yahoo"] },
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
}).options({ allowUnknown: false, stripUnknown: true });

/// Reset Password

export const resetPasswordValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "any.required": "OTP is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
}).options({ allowUnknown: false, stripUnknown: true });

// Forgot Password

export const resendOtpValidator = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "org", "hotmail", "yahoo"] },
    })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
}).options({ allowUnknown: false, stripUnknown: true });
