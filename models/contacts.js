const fs = require('fs/promises')
const { nanoid } = require("nanoid");
const path = require("path");


const contactsPath = path.join(__dirname,"./contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
    
   
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
    const contactsById = contacts.find(item => item.id === contactId);
    return contactsById || null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
    const index = contacts.findIndex(item=> item.id ===contactId);
    if (index===-1){
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

const addContact = async (name, email,phone) => {
  const contacts = await listContacts();
    const contact = {id:nanoid(),name, email, phone};
    contacts.push(contact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contact;
}

const updateContact = async (contactId, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
    if(index === -1){
        return null;
    }
    contacts[index] = {contactId, ...data};
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
