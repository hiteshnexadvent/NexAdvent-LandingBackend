const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, mobile: { type: String, required: true }, pass: { type: String, required: true }, role: { type: String, default: 'admin' }, otp: String, otpExpires: Date }, { timestamps: true });

const adminMong = mongoose.model('admins', adminSchema);

module.exports = adminMong;