const validator = require('validator');

exports.validateEmail = (email) => {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email address');
    }
  };

exports.validatePassword = (password) => {  
    if (password.length < 8) {
      throw new Error('Password should be at least 8 characters long');
    }
  
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[-+_!@#$%^&*.,?]/.test(password);
  
    if (!(hasLetter && hasNumber && hasSymbol)) {
      throw new Error('Password should include at least one letter, one number, and one symbol');
    }
};

exports.validatePhoneNumber = (phoneNumber) => {
  if (!/^\d{1,10}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number');
  }
  if (phoneNumber.length > 10) {
    throw new Error('Phone number should not exceed 10 digits');
  }
};