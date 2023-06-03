const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const {User} = require("../models/user");

const { ctrlWrapper} = require("../decorators");
const { HttpError } = require("../helpers");

const {SECRET_KEY} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async(req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if (user){
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body,password: hashPassword, avatarURL});

    res.status(201).json({
        password: newUser.password,
        email: newUser.email,
    })
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
}