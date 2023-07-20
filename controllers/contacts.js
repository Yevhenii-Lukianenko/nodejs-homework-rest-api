const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers/HttpError");
const { schema } = require("../models/contact");

const listContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = { owner };
    if (req.query.favorite === "true") {
      query.favorite = true;
    }

    const result = await Contact.find(query, "-__v", {
      skip,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const result = await Contact.findById(req.params.contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    const validationRequest = schema.addSchema.validate(req.body);
    if (validationRequest.error) {
      throw HttpError(400, validationRequest.error.message);
    }

    const result = await Contact.create({ ...req.body, owner });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.contactId);

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const validationResult = schema.updateSchema.validate(req.body);
    if (validationResult.error) {
      throw HttpError(400, validationResult.error.message);
    }

    const result = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      {
        new: true,
      }
    );

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const validationResult = schema.updateFavoriteSchema.validate(req.body);
    if (validationResult.error) {
      throw HttpError(400, "missing field favorite");
    }

    const result = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
