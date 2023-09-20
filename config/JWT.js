const { sign , verify } = require('jsonwebtoken');

exports.createToken = (name , role , type , id) => {
    const accessToken = sign({ name : name , role : role , type :type , id:id},
        "JWT_SECRET"
        );
    return accessToken;
}

exports.decodeJWT = async (req, res) => {
  const authtoken = req.headers.authorization;
  const token = authtoken?.replace('Bearer ', '') || req.cookies.accessToken;
  console.log(token);
  if (!token) {
    return res.status(400).json({ message: 'Missing token' });
  }

  const verifyPromise = () => {
    return new Promise((resolve, reject) => {
      verify(token, "JWT_SECRET", (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  };

  try {
    const decoded = await verifyPromise();
    return decoded;
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

exports.validateSuperAdmin = (req, res, next) => {
  // Retrieve the access token from the request headers or cookies
  const authtoken = req.headers.authorization;
  const accessToken = authtoken?.replace('Bearer ', '') || req.cookies.accessToken;

  if (accessToken) {
    verify(accessToken, "JWT_SECRET", (error, decoded) => {
      if (error) {
        res.status(400).json({ message: 'Access denied!' });
      } else {
        const { name, role, type } = decoded;
          if (role === 'admin') {
            if (type === 'super') {
                req.super = true;
                return next();
            } else {
                res.status(400).json({ message: 'Unauthorized access', status:false });
            }
        }else{
            res.status(400).json({ message: 'Unauthorized access', status:false });
        }
      }
    });
  } else {
    res.status(400).json({ message: 'Super Admin Access token required', status:false });
  }
};

exports.validateAdmin = (req, res, next) => {
    const authtoken = req.headers.authorization;
    const accessToken = authtoken?.replace('Bearer ', '') || req.cookies.accessToken;
  
    if (accessToken) {
      verify(accessToken, "JWT_SECRET", (error, decoded) => {
        if (error) {
          res.status(400).json({ message: 'Access denied!', status:false });
        } else {
          const { name, role, type } = decoded;
            if (role === 'admin') {
                  req.admin = true;
                  next();
            }else{
                res.status(400).json({ message: 'Unauthorized access', status:false });
            }
        }
      });
    } else {
      res.status(400).json({ message: ' Admin Access required', status:false });
    }
  };

  exports.validateToken = (req, res, next) => {
    const authtoken = req.headers.authorization;
    const accessToken = authtoken?.replace('Bearer ', '') || req.cookies.accessToken;
  
    if (accessToken) {
      verify(accessToken, "JWT_SECRET", (error, decoded) => {
        if (error) {
            res.status(400).json({ message: 'Access denied!', status:false });
        } else {
            req.user = true;
            next();
        }
      });
    } else {
      res.status(400).json({ message: ' User Access required', status:false });
    }
  };
