const { Schema, model } = require("mongoose");
const joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
      required: [true, "Subscription is required"],
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const updateSubscriptionSchema = joi.object({
  subscription: joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

const schema = { registerSchema, loginSchema, updateSubscriptionSchema };

module.exports = { User, schema };
