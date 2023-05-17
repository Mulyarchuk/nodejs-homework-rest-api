
const contactsService = require(`../models/contacts`);
const {HttpError} = require("../helpers");



const {ctrlWrapper} = require("../decorators");


const listContacts = async (req, res) => {
    
      const result = await contactsService.listContacts()
      res.json(result);
    
  };

const getContactById = async (req, res) => {
    
      const{contactId} = req.params;
      const result = await contactsService.getContactById(id);
      if(!result){
        throw HttpError(404, `Contact witn ${contactId} not found`);
      }
      res.json(result)
    
  };

const addContact = async (req, res) => {
    
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result)
    
  };

const removeContact =  async (req, res) => {
  
      const { contactId } = req.params;
      const result = await contactsService.removeContact(contactId);
      if (!result) {
          throw HttpError(404, "Not found");
      }
      res.json({
          message: "Delete success"
      })
    
  };

const updateContact = async (req, res) => {
    
      const { contactId } = req.params;
      const result = await contactsService.updateContact(contactId, req.body);
      if (!result) {
          throw HttpError(404, "missing fields");
      }
  
      res.json(result);
  
  }

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
  }
