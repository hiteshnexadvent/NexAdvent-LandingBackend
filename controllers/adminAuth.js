const adminMong = require('../models/Admin_Mong');
const bcrypt = require('bcrypt');
const forgetOtp = require('../utils/forgetPass');


exports.getadminSignup = (req, res) => {
    return res.render('adminSignup');
}

exports.postadminSignup = async (req, res) => {
    
    const { name, email, mobile, pass } = req.body;

    try {
        const exist = await adminMong.findOne({ email });

        if (exist) {
            return res.send('<script>alert("Admin with this email already exist"); window.history.back();</script>');
        }

        const hashedPass = await bcrypt.hash(pass, 10);

        const newAdmin = new adminMong({
            name, email, mobile, pass: hashedPass
        })

        await newAdmin.save();

        return res.render('adminLogin', { message: 'Admin registered successfully!' });

    }
    catch (err) {
        return res.send('<script>alert("Unable to register"); window.history.back();</script>');
    }

}

// ---------------------------- admin login


exports.postadminLogin = async (req, res) => {
    
    try {
        
        const { email, pass } = req.body;

        const admin = await adminMong.findOne({ email });

        if (!admin) {
            return res.send('<script>alert("Admin does not exist"); window.history.back();</script>');
        }

        const match = await bcrypt.compare(pass, admin.pass);

        if (match) {
            req.session.adminEmail = { name: admin.name,email:admin.email };
            return res.redirect(`/admin/dashboard`);
            // return res.send('<script>alert("Admin Login"); window.history.back();</script>');

        } else {
            return res.send('<script>alert("Incorrect Password"); window.history.back();</script>');            
        }

    } catch (error) {
        return res.send('<script>alert("Admin does not exist"); window.history.back();</script>');
    }

}

// ------------------------------ admin Dashboard

exports.getAdminDash=async (req,res) => {
    
    try {
        
        if (!req.session.adminEmail) {
            return res.render('adminLogin');
        } else {
            const { name } = req.session.adminEmail;
            return res.render('adminDash', { name });
        }

    } catch (error) {
        console.log(error.message);
    }

}

// ------------------------------ admin Change Password

exports.getChangePassword = (req, res) => {
    
    try {
        
        if (!req.session.adminEmail) {
            return res.render('adminLogin');
        } else {
            return res.render('changePass');
        }

    } catch (error) {
        console.log(error.message);
    }

}

exports.postchangePassword = async (req, res) => {
        
        const { password, npassword, cnpassword } = req.body;

        if (!password || !npassword || !cnpassword) {
            return res.send('<script>alert("All fields are mandatory"); window.history.back();</script>');
        }

        if (npassword !== cnpassword) {
            return res.send('<script>alert("Password and Confirm Password must be same"); window.history.back();</script>');
        }

        const email = req.session.adminEmail;

        if (!email) {
            return res.render('adminLogin');
    }
    
    try {

        const adminn = await adminMong.findOne({ email: email.email });

        if (!adminn) {
            return res.send('<script>alert("Old Password is incorrect"); window.history.back();</script>');
        }

        const isMatch = await bcrypt.compare(password, adminn.pass);

        if (!isMatch) {
            return res.send('<script>alert("Old Password is Incorrect"); window.history.back();</script>');
        }

        const hashedNewPass = await bcrypt.hash(npassword, 10);

        adminn.pass = hashedNewPass;

        await adminn.save();

        return res.send('<script>alert("Password Changed Successfully"); window.history.back();</script>');

    } catch (error) {        
        return res.send(error.message);
    }

}

// -------------------------------- forget password

exports.getForgetPass = async (req, res) => {
    return res.render('forgetPass');
}

exports.postForgetPass = async (req, res) => {
    
    try {
        
        const { email } = req.body;

        const existadmin = await adminMong.findOne({ email });

        if (!existadmin) {
            return res.send('<script>alert("Admin not exist"); window.history.back();</script>');
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000;

        existadmin.otp = otp;
        existadmin.otpExpires = otpExpires;
        await existadmin.save();

        await forgetOtp(email, otp);

        return res.render('verifyOtp', { email });

    } catch (error) {
        return res.send(error.message);
    }

}

exports.verifyOtp = async (req, res) => {

    try {
        
        const { email, otp } = req.body;
        const admin = await adminMong.findOne({ email });

        if (!admin || admin.otp?.toString() !== otp || admin.otpExpires < Date.now()) {
            return res.send('<script>alert("Invalid or expired OTP"); window.history.back();</script>');
        }

        return res.render('resetForgetPass', { email });

    } catch (error) {
        return res.send('<script>alert("Something went wrong"); window.history.back();</script>');
    }
    
}

exports.resetForgetPassword = async (req, res) => {
    
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send('<script>alert("Passwords do not match"); window.history.back();</script>');
    }

    const admin = await adminMong.findOne({ email });

    if (!admin) {
        return res.send('<script>alert("Admin not found"); window.location="/admin/forget";</script>');
    }

    const hashedPass = await bcrypt.hash(password, 10);
    admin.pass = hashedPass;
    admin.otp = undefined;
    admin.otpExpires = undefined;

    await admin.save();

    return res.send('<script>alert("Password changed successfully"); window.location="/";</script>');
    
}


// --------------------------------- signout

exports.getadminSignout = async (req, res) => {

    if (!req.session.adminEmail) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.send('<script>alert("Unable to logout."); window.history.back();</script>');
        }
        res.clearCookie('connect.sid'); 
        return res.redirect('/');
    })
}