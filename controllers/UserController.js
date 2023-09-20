const userService = require('../services/UserService.js');
const validations = require('../services/ValidationService.js');
const jwt = require("../config/JWT.js");

// Register a new user
// exports.registerUser = async (req, res) => {
//     if (!req.body) {
//         return res.status(400).json({ error: 'data is missing in the request body' });
//     }
//     const StoryImage = await cloudinary.uploader.upload(
//       req.file.path,
//       { folder: "UserCleanImage" },
//       function (error, result) {
//         console.log(result, error);
//       }
//     );
//     const { name, dob, phone, email, password, suburb} = req.body;
//     const image = StoryImage.secure_url
//     try {
//         validations.validateEmail(email);
//         validations.validatePassword(password);
//         validations.validatePhoneNumber(phone);
//         const result = await userService.registerUser(name, dob, phone, email, password, image, suburb);
//         if(result.status){
//           res.status(200).json({message :result.message, status:true});
//         }else{
//           res.status(400).json({message :result.message, status:false});
//         }    } catch (error) {
//         res.status(400).json({ error: error.message , status:false});
//     }
// };

exports.login = async (req,res) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser(email, password);
    res.cookie("accessToken", result.accessToken, {
      maxAge: 3600000,
      httpOnly: true,
    });
    if(result.status){
      res.status(200).json({message :result.message , accessToken: result.accessToken , userType: result.userType , adminType : result.admintype, status:true});
    }else{
      res.status(400).json({message :result.message, status:false});
    }  } catch (error) {
    res.status(400).json({ error: "Internal Server Error", status:false });
  }
}

exports.createUser = async (req,res) => {
  

    const { name , dob, phone, email , userType , password , adminType} = req.body;
    
    try{
        validations.validateEmail(email);
        validations.validatePassword(password);
        validations.validatePhoneNumber(phone);
        
        if(userType==="admin"){
            const result = await userService.createAdmin(name, dob, phone, email, password , adminType);
            if(result.status){
              res.status(200).json({message :result.message, status:true});
            }else{
              res.status(400).json({message :result.message, status:false});
            }        }
    } catch (error) {
        res.status(400).json({ error: error.message , status:false});
    }
};

exports.editUser = async (req,res) => {
    const { name , dob, phone, email, userType } = req.body;
    const id=req.params.id;
    try{;
        validations.validatePhoneNumber(phone);
        if(userType==="admin"){
            const result = await userService.editAdmin(name, dob, phone , email , id);
            console.log("first",result.name)
            if(result.status){
              res.status(200).json({message :result.message, status:true});
            }else{
              res.status(400).json({message :result.message, status:false});
            }        }
    } catch (error) {
        res.status(400).json({ error: error.message , status:false});
    }
   
};

exports.deleteUser = async (req,res) => {
    const { email } = req.body;
    const id=req.params.id;
    try{
        const result = await userService.deleteUser(id);
        if(result.status){
          res.status(200).json({message :result.message, status:true});
        }else{
          res.status(400).json({message :result.message, status:false});
        }
    } catch (error) {
        res.status(400).json({ error: 'Internal Server Error', status:false });
    }
}

exports.getAllUsers = async (req,res) => {
    try{
        const result = await userService.getAllUsers();
        res.status(200).json({result :result, status:true});
    } catch (error) {
        res.status(400).json({ error: 'Internal Server Error', status:false });
    }
}

exports.searchUser = async (req,res) => {
    const name = req.params.name;
    try{
        const result = await userService.searchUser(name);
        res.status(200).json({result :result, status:true});
    } catch (error) {
        res.status(400).json({ error: 'Internal Server Error', status:false });
    }
}

// exports.getVerificationCode = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const result = await userService.getVerificationCode(email);

//     if (result.status) {
//       res.status(200).json({ message: result.message, userId:result.userId , status:true});
//     } else {
//       res.status(400).json({ error: result.message , status:false});
//     }
//   } catch (error) {
//     res.status(400).json({ error: "Error in password reset" , status:false});
//   }
// };

exports.getVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await userService.getVerificationCode(email);
    console.log("result",result)
    if (result.status) {
      res.status(200).json({ message: result.message, userId:result.userId , status:true});
    } else {
      res.status(400).json({ error: result.message , status:false});
    }
  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(400).json({ error: "Error in password reset" , status:false});
    
  }
};

exports.verifyCode = async (req, res) => {
  const { userId, verificationCode } = req.body;

  try {
    var result = await userService.verifyCode(userId, verificationCode);
    if (result.status) {
      res.status(200).json({ message: result.message , status:true});
    } else {
      res.status(400).json({ error: result.message , status:false});
    }
  } catch (error) {
    res.status(400).json({ error: "Error in Otp verification" , status:false});
  }
};

exports.updatePassword = async (req, res) => {
  const { updatedPassword } = req.body;
  const userId = req.params.userId;

  try {
    validations.validatePassword(updatedPassword);
    var result = await userService.updatePassword(userId, updatedPassword);
    if (result.status) {
      res.status(200).json({ message: result.message , status:true});
    } else {
      res.status(400).json({ error: result.message , status:false});
    }
  } catch (error) {
    res.status(400).json({ error: error.message , status:false});
  }
};

exports.getProfile = async (req,res) => {
  const user =await jwt.decodeJWT(req);
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: 'Invalid or missing token' , status:false});
  }
  const id = user.id;
  try{
      const result = await userService.getUserId(id);
      res.status(200).json({result :result, status:true});
  } catch (error) {
      res.status(400).json({ error: 'Internal Server Error', status:false });
  }
}
