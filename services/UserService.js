const userModel = require("../repository/UserRepo.js");
const jwt = require("../config/JWT.js");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const environmentalVariables = require("dotenv").config();
const nodemailer = require("nodemailer");
const mailTransporter = require("../config/email.js");


app.use(cookieParser());
// exports.registerUser = async (name, dob, phone, email, password, suburb,image) => {
//   try {
//     const existingUser = await userModel.findByEmailUser(email);
//     if (existingUser > 0) {
//       return { message: "Email already registered" , status: false};
//     }
//     const existingUserAdmin = await userModel.findByEmailAdmin(email);
//     if (existingUserAdmin > 0) {
//       return { message: "Email already registered" ,status: false};
//     }
//     await userModel.create(name, dob, phone, email, password, suburb,image);

//     return { message: 'User registered successfully',status: true };
//     } catch (error) {
//         return{ message: error.message};
//   }
// };

exports.loginUser = async (email, password) => {
  try {
      const existingUserAdmin = await userModel.findByEmailAdmin(email);
      if (existingUserAdmin > 0) {
        const passwordMatch = await userModel.checkPasswordMatchAdmin(
          email,
          password
        );
        if (passwordMatch) {
          const admin = await userModel.getAdmin(email);
          const accessToken = jwt.createToken(
            admin.name,
            "admin",
            admin.type,
            admin.id
          );
          return {
            message: "User logged in successfully",
            accessToken: accessToken,
            status: true,
            userType: 'admin',
            admintype: admin.type
          };
        } else {
          return { message: "User entered wrong password",status: false };
        }
      } else {
        return { message: "No any registered user for this email",status: false };
      }
  
  } catch (error) {
    throw error;
  }
};

exports.createAdmin = async (name, dob, phone, email, password , adminType,image) => {
  try {
  
    const existingUserAdmin = await userModel.findByEmailAdmin(email);
    if (existingUserAdmin > 0) {
          return{ message: 'Email already registered',status: false};
    }
    await userModel.createAdminUser(name, dob, phone, email, password , adminType);
    return { message: 'User registered successfully',status: true };
    } catch (error) {
          throw error;
  }
};

// exports.editUser = async (name, dob, phone, suburb,email,id) => {
//   try {
//     const existingUser = await userModel.findByEmailUser(email);
//     if (existingUser > 0) {
//       await userModel.updateUser(name, dob, phone , suburb, id);
//       return{ message: 'Updated Successfully',status: true};
//     }else{
//       return { message: 'User not found!' ,status: false};
//     }
//     } catch (error) {
//         throw error;
//   }
// };

exports.editAdmin = async (name, dob, phone,email,id) => {
  try {
    const existingUser = await userModel.findByEmailAdmin(email);
    if (existingUser > 0) {
      await userModel.updateAdmin(name, dob, phone,id);
      return{ message: 'Updated Successfully', status: true};
    }else{
      return { message: 'User not found!',status: false };
    }
  } catch (error) {
    throw error;
  }
};

// exports.editAdmin = async (name, dob, phone, email) => {
//   try {
//     const existingUser = await userModel.findByEmailAdmin(email);
//     if (existingUser > 0) {
//       await userModel.updateAdmin(name, dob, phone, email);
//       return { message: "Updated Successfully",status: true };
//     } else {
//       return { message: "User not found!" ,status: false};
//     }
//   } catch (error) {
//     throw error;
//   }
// };

exports.deleteUser = async (id) => {
    try {
      
        const existingAdmin = await userModel.findByIdAdmin(id);
        if (existingAdmin > 0) {
            const admin = await userModel.getAdminId(id);
            if(admin.type==='super'){
                return{ message: 'Delete not allowed super admin account'};
            }else{
                await userModel.deleteAdmin(id);
                return{ message: 'Delete Successfully',status: true};
            }
      } else {
        return { message: "User not found!" ,status: false};
      }
    
  } catch (error) {
  throw error;
  };
}
// exports.getAllUsers = async () => {
//   try {
//     const Users = await userModel.getUsers();
//     return Users;
//     } catch (error) {
//         throw error;
//   }
// };

// exports.searchUser = async (name) => {
//   try {
//     const User = await userModel.searchUser(name);
//     return User;
//     } catch (error) {
//         throw error;
//   }
// };

// exports.getVerificationCode = async (email) => {
//   try {
//     let randomNumber = Math.floor(Math.random() * 10000);
//     let fourDigitNumber = randomNumber.toString().padStart(4, "0");

//     const user = await userModel.getAdmin(email);
//     if (!user) {
//       return { message: "User not exist", status: false };
//     }

//     const AdminId = user.id;
//     const isOtpDelete = await userModel.deleteVarificationCode(AdminId);

//     if (!isOtpDelete) {
//       return { message: "Otp Genaration Faild", status: false };
//     }

//     let details = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Reset Password",
//       text: "Your verification code is " + fourDigitNumber,
//     };

//     return new Promise((resolve, reject) => {
//       mailTransporter.sendMail(details, async (err) => {
//         if (err) {
//           reject({ message: "Email not sent", status: false });
//         } else {
//           const isDataRecorded = await userModel.addVarificationCode(
//             email,
//             AdminId,
//             fourDigitNumber
//           );

//           if (!isDataRecorded) {
//             reject({ message: "Otp Record Faild", status: false });
//           }
//           resolve({
//             message: "Varification Code sent successfully",
//             status: true,
//             userId: AdminId,
//           });
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// exports.getVerificationCode = async (email) => {
//   try {
//     let randomNumber = Math.floor(Math.random() * 10000);
//     let fourDigitNumber = randomNumber.toString().padStart(4, "0");

//     const user = await userModel.getAdmin(email);
//     console.log("user",user)
//     if (!user) {
//       return { message: "User not exist", status: false };
//     }

//     const userId = user.id;
//     console.log("first",userId)
//     const isOtpDelete = await userModel.deleteVarificationCode(userId);
//     console.log("2",isOtpDelete)

//     if (!isOtpDelete) {
//       return { message: "Otp Genaration Faild", status: false };
//     }

//     let details = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Reset Password",
//       text: "Your verification code is " + fourDigitNumber,
//     };
//     console.log("3",details)
//     return new Promise((resolve, reject) => {
//       console.log("4")
//       mailTransporter.sendMail(details, async (err) => {
//         console.log("5")
//         if (err) {
//           reject({ message: "Email not sent", status: false });
//         } else {
//           console.log("6")
//           const isDataRecorded = await userModel.addVarificationCode(
//             email,
//             userId,
//             fourDigitNumber
//           );

//           if (!isDataRecorded) {
//             reject({ message: "Otp Record Faild", status: false });
//           }
//           resolve({
//             message: "Varification Code sent successfully",
//             status: true,
//             userId: userId,
//           });
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

exports.getVerificationCode = async (email) => {
  try {
    let randomNumber = Math.floor(Math.random() * 10000);
    let fourDigitNumber = randomNumber.toString().padStart(4, "0");

    const user = await userModel.getAdmin(email);
    console.log("user", user);
    if (!user) {
      return { message: "User not exist", status: false };
    }

    const userId = user.id;
    console.log("first", userId);
    const isOtpDelete = await userModel.deleteVarificationCode(userId);
    console.log("2", isOtpDelete);

    if (!isOtpDelete) {
      return { message: "Otp Generation Failed", status: false };
    }

    let details = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: "Your verification code is " + fourDigitNumber,
    };
    console.log("3", details);

    // await new Promise((resolve, reject) => {
    //   console.log("4");
    //   mailTransporter.sendMail(details, async (err) => {
    //     console.log("5");
    //     if (err) {
    //       reject({ message: "Email not sent", status: false });
    //     } else {
    //       console.log("6");
    //       const isDataRecorded = await userModel.addVarificationCode(
    //         email,
    //         userId,
    //         fourDigitNumber
    //       );
    //         console.log("7",isDataRecorded)
    //       if (!isDataRecorded) {
    //         reject({ message: "Otp Record Failed", status: false });
    //       }
    //       console.log("8")
    //       resolve({
    //         message: "Verification Code sent successfully",
    //         status: true,
    //         userId: userId,
    //       });
    //     }
    //   });
    // });
    await new Promise((resolve, reject) => {
      console.log("4");
      mailTransporter.sendMail(details, async (err) => {
        console.log("5");
        if (err) {
          console.error("Email sending error:", err); // Log the error for debugging
          reject({ message: "Email not sent", status: false });
        } else {
          console.log("6");
          const isDataRecorded = await userModel.addVarificationCode(
            email,
            userId,
            fourDigitNumber
          );
          console.log("7", isDataRecorded);
          if (!isDataRecorded) {
            reject({ message: "Otp Record Failed", status: false });
          }
          console.log("8");
          resolve({
            message: "Verification Code sent successfully",
            status: true,
            userId: userId,
          });
        }
      });
    });
    
  } catch (error) {
    // Handle errors here
    console.error("Error in getVerificationCode:", error);
    throw error;
  }
};


exports.verifyCode = async (userId, verificationCode) => {

  try {
    const otpResult = await userModel.verifyCode(userId, verificationCode);

    if (Object.keys(otpResult).length == 0) {
      return { message: "Not found Otp", status: false };
    }

    const isOtpDelete = await userModel.deleteVarificationCode(userId);

    if (!isOtpDelete) {
      return { message: "Otp remove faild", status: false };
    }

    return { message: "Verify successfully", status: true };
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (userId, updatePassword) => {
  try {
    const result = await userModel.updatePassword(userId, updatePassword);
    if (!result) {
      return { message: "Password update faild", status: false };
    }

    return { message: "Password Updated successfully", status: true };
  } catch (error) {
    throw error;
  }
};

exports.getUserId = async (id) => {
  try {
      const admin = await userModel.getAdminId(id);
      return admin;
    
    } catch (error) {
        throw error;
  }
};

exports.getUserName = async (id) => {
  try {
    
      const admin = await userModel.getAdminId(id);
      return admin;
    
    } catch (error) {
        throw error;
  }
};

