const { Schema, model } = require("mongoose");
const joi = require("joi");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const addSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .pattern(/^(\+)?\d{10,12}$/)
    .required(),
  favorite: joi.boolean(),
});

const updateSchema = joi
  .object({
    name: joi.string().min(2).max(30),
    email: joi.string().email(),
    phone: joi.string().pattern(/^(\+)?\d{10,12}$/),
  })
  .or("name", "email", "phone");

const updateFavoriteSchema = joi.object({
  favorite: joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

const schema = { addSchema, updateSchema, updateFavoriteSchema };

module.exports = { Contact, schema };
