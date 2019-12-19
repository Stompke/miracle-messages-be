const express = require("express");
const router = express.Router();

require("dotenv").config();

const nodemailer = require("nodemailer");

const Volunteer = require("../models/volunteer-model.js");

// To find the req.body of id and email to make sure that the email exists in the database
router.get("/getvolunteer", (req, res) => {
  const email = req.body;

  Volunteer.findEmail(email)
    .then(mail => {
      res.status(200).json(mail);
    })
    .catch(error => {
      console.log("Catch", error);
      res.status(500).json({ error: "You are getting back the catch" });
    });
});

// To replace volunteers old password with new one
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  Volunteer.updateVolunteer(id, body)
    .then(mail => {
      res.status(200).json(mail);
    })
    .catch(error => {
      res.status(500).json({ message: "Internal Server Error", error });
    });
});

router.post("/forgotPassword", (req, res) => {
  if (req.body.email === "") {
    res.status(400).send("email required");
  }
  console.error(req.body.email);
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user === null) {
      console.error("email not in database");
      res.status(403).send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          email: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      });

      const mailOptions = {
        from: "agarcf5@gmail.com",
        //   hello@miraclemessages.org
        to: `${user.email}`,
        subject: "Link To Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://localhost:3000/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };

      console.log("sending mail");

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
});

module.exports = router;
