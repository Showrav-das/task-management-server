import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("first", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("ismatch", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      //   secure: true, // true for 465, false for other ports
      auth: {
        user: "showravdas8@gmail.com",
        pass: "fheraacjawpfqygo",
      },
    });

    const token = "we35r";
    console.log("env", process.env.CLIENT_URL);
    const verificationUrl = `${process.env.CLIENT_URL}/reset-password/?token=${token}&email=${email}`;
    // Email template
    const mailOptions = {
      from: "showravdas8@gmail.com",
      to: email,
      subject: "Please reset your password",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin-bottom: 20px;">We heard that you lost your GitHub password. Sorry about that! But don’t worry! You can use the following button to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; 
                          background-color: #007bff; 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 5px;
                          font-weight: bold;">
                 Reset your password
                </a>
              </div>
              
              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                If the button doesn't work, you can copy and paste this link into your browser:
                <br>
                <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
            </div>
          </div>
        `,
    };
    await transporter.sendMail(mailOptions);
    res.send("ok");
  } catch (error) {
    console.log("error", error.messsage);
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { password, email } = req.body;
    console.log("first", req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("error", error.message);
  }
};

export const profileController = async (req, res) => {
  const { email } = req.params;
  console.log("email", email);
  const user = await User.findOne({ email });
  res.send({ user });
};

export const updateProfileController = async (req, res) => {
  try {
    const { _id, username, designation, email } = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          username,
          designation,
          email,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
