const express = require('express');
const { getadminSignup, postadminSignup, postadminLogin, getAdminDash, getadminSignout } = require('../controllers/adminAuth');
const { postUser, getManageQuery } = require('../controllers/userAuth');
const router = express.Router();

router.get('/signup', getadminSignup);
router.post('/adminSignup', postadminSignup);
router.post('/login', postadminLogin);
router.get('/dashboard', getAdminDash);
router.get('/signout', getadminSignout);

router.post('/user-query', postUser);
router.get('/manage-userquery', getManageQuery);



module.exports = router;