const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, mobile: { type: String, required: true }, pass: { type: String, required: true } }, { timestamps: true });

const adminMong = mongoose.model('admins', adminSchema);

module.exports = adminMong;