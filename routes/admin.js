const express = require('express');
const { getadminSignup, postadminSignup, postadminLogin, getAdminDash, getadminSignout, getChangePassword, postchangePassword, getForgetPass, postForgetPass, verifyOtp, resetForgetPassword } = require('../controllers/adminAuth');
const { postUser, getManageQuery, deleteQuery } = require('../controllers/userAuth');
const router = express.Router();

router.get('/signup', getadminSignup);
router.post('/adminSignup', postadminSignup);
router.post('/login', postadminLogin);
router.get('/dashboard', getAdminDash);
router.get('/signout', getadminSignout);

router.post('/user-query', postUser);
router.get('/manage-userquery', getManageQuery);
router.get('/delete-query/:id', deleteQuery);

router.get('/change-password', getChangePassword);
router.post('/change-password', postchangePassword);

router.get('/forget-password', getForgetPass);
router.post('/forget-password', postForgetPass);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetForgetPassword);


module.exports = router;