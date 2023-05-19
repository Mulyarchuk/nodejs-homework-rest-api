
// const contactsService = require(`../models/contacts`);
const Contact = require("../models/contact")
const {HttpError} = require("../helpers");



const {ctrlWrapper} = require("../decorators");


const listContacts = async (req, res) => {
    
      const result = await Contact.find();
      res.json(result);
    
  };

const getContactById = async (req, res) => {
    
      const {contactId} = req.params;
      const result = await Contact.findById(contactId);
      if(!result){
        throw HttpError(404, `Contact witn ${contactId} not found`);
      }
      res.json(result)
    
  };

const addContact = async (req, res) => {
    
      const result = await Contact.create(req.body);
      res.status(201).json(result)
    
  };

const removeContact =  async (req, res) => {
  
      const { contactId } = req.params;
      const result = await findByIdAndRemove(contactId);
      if (!result) {
          throw HttpError(404, "Not found");
      }
      res.json({
          message: "Delete success"
      })
    
  };

const updateContact = async (req, res) => {
    
      const { contactId } = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body);
      if (!result) {
          throw HttpError(404, "missing fields");
      }
  
      res.json(result);
  
  }

  const updateStatusContact = async (req, res) => {
    
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
        throw HttpError(404, " Not found ");
    }

    res.json(result);

}

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
  }
