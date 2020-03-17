const userRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/userControllers');
const { send405Error } = require('../errorHandling.js');

userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(send405Error);

module.exports = { userRouter };
