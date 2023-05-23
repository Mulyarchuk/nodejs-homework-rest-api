const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../helpers")
const Joi = require("joi");

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
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
  });

  contactSchema.post("save",handleMongooseError);

  const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
  })

  const Contact = model("contact", contactSchema);

  module.exports = {
    Contact,
    contactAddSchema,
    updateFavoriteSchema,
};