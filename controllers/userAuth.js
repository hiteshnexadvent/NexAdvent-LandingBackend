const userMong = require('../models/User_Mong');
const axios = require('axios');

// --------------------------------- user queries

exports.postUser = async (req, res) => {
    
  const { name, email, mobile, city, company, captcha } = req.body;

//   const error = validationResult(req);

//   if (!error.isEmpty()) {
//     return res.status(400).json({ message: error.array()[0].msg });
//   }

  if (!captcha) {
    return res
      .status(400)
      .json({ success: false, message: "No captcha token" });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", captcha);

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params
    );

      const newUser = new userMong({
      name,
      email,
      mobile,
      city,
      company
    });

      await newUser.save();
      return res
          .status(201)
          .json({
              message:
                "Your request have been submitted. We'll get in touch with you soon.",           
          });
      
  } catch (error) {
    console.error("CAPTCHA or DB error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }    

}

// --------------------------- manage queries

exports.getManageQuery = async (req, res) => {
  if (!req.session.adminEmail) {
      return res.render("adminLogin");
  } else {   
      try {
        const query = await userMong.find().sort({ createdAt: -1 });
        return res.render("manageUserQuery", { query });
    } catch (error) {
      console.log(error.message);
    }
  }
};

// ----------------- delete queries

exports.deleteQuery = async (req, res) => {
  try {
    await userMong.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/manage-userquery");
  } catch (error) {
    return res.send(
      '<script>alert("Unable to delete"); window.history.back();</script>'
    );
  }
};
