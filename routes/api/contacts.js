const express = require('express');
const contactsController = require("../../controllers/contact-controllers")

const router = express.Router();

const schemas = require("../../models/contact");
const {validateBody} = require("../../decorators");
const {authenticate} = require("../../middlewares");

router.use(authenticate);

router.get('/', contactsController.listContacts);

router.get('/:contactId', contactsController.getContactById);

router.post('/',validateBody(schemas.contactAddSchema), contactsController.addContact);

router.delete('/:contactId',contactsController.removeContact);

router.put('/:contactId',validateBody(schemas.contactAddSchema), contactsController.updateContact);

router.patch('/:contactId/favorite',validateBody(schemas.updateFavoriteSchema), contactsController.updateStatusContact);

module.exports = router;
