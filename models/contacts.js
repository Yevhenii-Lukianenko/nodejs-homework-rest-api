const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const response = await fs.readFile(contactsPath);
  const contacts = JSON.parse(response);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const contactById = await getContactById(contactId);

  if (contactById === null) {
    return null;
  }

  const contacts = await listContacts();
  const updetedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  fs.writeFile(contactsPath, JSON.stringify(updetedContacts, null, 2));
  return contactById;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = [
    {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone,
    },
  ];
  contacts.push(...newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  if (body.name) {
    contacts[index].name = body.name;
  }
  if (body.email) {
    contacts[index].email = body.email;
  }
  if (body.phone) {
    contacts[index].phone = body.phone;
  }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
