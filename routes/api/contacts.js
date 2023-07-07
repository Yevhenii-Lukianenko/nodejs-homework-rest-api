const express = require("express");
const joi = require("joi");

const router = express.Router();

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

//  ==== validation
const postSchema = joi.object({
  name: joi.string().min(2).max(30).required(),
  email: joi.string().email().required(),
  phone: joi
    .string()
    .pattern(/^(\+)?\d{10,12}$/)
    .required(),
});

const putSchema = joi
  .object({
    name: joi.string().min(2).max(30),
    email: joi.string().email(),
    phone: joi.string().pattern(/^(\+)?\d{10,12}$/),
  })
  .or("name", "email", "phone");
// ==== end validation

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await contacts.getContactById(req.params.contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validationRequest = postSchema.validate(req.body);
    if (validationRequest.error) {
      throw HttpError(400, validationRequest.error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await contacts.removeContact(req.params.contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const validationResult = putSchema.validate(req.body);
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }
    const result = await contacts.updateContact(req.params.contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
