const express = require("express");
const router = express.Router();

const contacts = require("../../controllers/contacts");
const authenticate = require("../../middlewares/authenticate");

router.get("/", authenticate, contacts.listContacts);

router.get("/:contactId", authenticate, contacts.getContactById);

router.post("/", authenticate, contacts.addContact);

router.delete("/:contactId", authenticate, contacts.removeContact);

router.put("/:contactId", authenticate, contacts.updateContact);

router.patch(
  "/:contactId/favorite",
  authenticate,
  contacts.updateStatusContact
);

module.exports = router;
