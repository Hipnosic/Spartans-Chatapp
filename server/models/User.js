const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'The password should be at least 6 characters long']
    },
})
// This middleware function ensures that the password is hashed before saving a new user document or updating an existing user document, which is a common security practice to store password securely in the database.
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next()
})
// This static method can be used to authenticate users during the login process by checking if the provided email and password match the stored user credentials in the database.
userSchema.statics.login = async function (email, password){
    const user = await this.findOne({email});
    if(user){
        const isAuthenticated = await bcrypt.compare(password,user.password);
        if(isAuthenticated){
            return user;
        }else{
            throw Error('Incorrect password');
        }
    }else{
        throw Error('Incorrect email');
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;