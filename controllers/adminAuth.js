const adminMong = require('../models/Admin_Mong');
const bcrypt = require('bcrypt');


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