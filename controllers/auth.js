const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const {User} = require("../models/user");

const { ctrlWrapper} = require("../decorators");
const { HttpError } = require("../helpers");

const {SECRET_KEY, PORT=3000} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if (user){
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body,password: hashPassword, avatarURL, verificationCode});

    const link = `http://localhost:${PORT}/api/auth/verify/${verificationCode}`;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href=${link}>test message</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  res.status(200).json({ message: "Verification success" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = User.findOne({ email });

  if (!user) {
    throw HttpError(404);
  }

  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }

  const link = `http://localhost:${PORT}/api/auth/verify/${user.verificationCode}`;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href=${link}>test message</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Verify Email Send",
  });
};



const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    const {_id:id} = user;
    const payload = {
        id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    res.json({
        token,
    })
};

const getCurrent = async(req, res)=> {
    const {email, name} = req.user;

    res.json({
        email,
        name,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;

    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(200).json({
        message: "Logout success"
    })
};

const updateAvatar = async(req, res)=>{
const {path: tempUpload, originalname} = req.file;
const filename = `${_id}_${originalname}`;
const resultUpload = path.join(avatarsDir, filename);
await fs.rename(tempUpload, resultUpload);
const avatarURL = path.join("avatars", filename);
await User.findByIdAndUpdate(_id, {avatarURL});

if(!User){
    throw HttpError(401, "Not authorized");
}

   res.status(200).json({
    avatarURL,
   })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}