const express = require("express");
const conn = require("../connection");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = require("../services/auth");


// API ROUTES
router.post('/register', (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  // console.log(req.body);
  if(user.email != null) {
    sqlQuery = "SELECT * FROM users WHERE email=?";
    conn.query(sqlQuery, [user.email], (err, result) => {
  
      if(!err) {
        if(result.length <= 0 ) {
          sqlQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
          conn.query(sqlQuery, [user.name, user.email, user.password], (error, results) => {
            if(!error) {
              return res.status(200).json({ message: 'Registered Successfully !', code: 200});
            } else {
              return res.status(500).json(error);
            }
          });
  
        } else {
          return res.status(400).json({ message: "Email is already exist !"});
        }
      }
      else {
        return res.status(500).json(err);
      }
    });
  }
});

router.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  if(user.email !== '' && user.password != '') {
    sqlQuery = "SELECT email, password FROM users WHERE email = ?";
    conn.query(sqlQuery, [user.email], (err, result) => {
      // console.log(result[0])
      if(result[0]) {
        if(result[0].length <= 0 || result[0].password != user.password) {
          return res.status(401).json({message: 'Incorrect Password !'});
        }else if (result[0].password == user.password) {
          const response = { email: result[0].email, name: result[0].name };
          const access_token = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'});
          res.status(200).json({token: access_token, message: 'You are now logged in'});
        } else {
          return res.status(400).json({message: 'Something wrong. Please try again later'});
        }
      } else {
        return res.status(500).json({ message: user.email + ' is not exist., Please check your email address !'});
      }
    });
  }

});

router.get('/user-detail/:id', auth.authToken, (req, res) => {
  const id = req.params.id;
  let sqlQuery = "SELECT * FROM users WHERE id = ? ORDER BY id";
  conn.query(sqlQuery, [id], (error, result) => {
    if(!error) {
        return res.status(200).json(result);
    } else {
      return res.status(500).json(error);
    }
  });
});

router.get('/checkToken', auth.authToken, (req, res) => {
  return res.status(200).json({ message: 'true'});
});

router.post('/change-password', auth.authToken, (req, res) => {
  const user = {
    old_password: req.body.old_password,
    new_password: req.body.new_password
  }
  const email = res.locals.email;
  let sqlQuery = "SELECT * FROM users WHERE email = ? AND password = ? ";
  conn.query(sqlQuery, [email, user.old_password], (error, result) => {
    if(!error) {
      if(result.length <= 0) {
        return res.status(400).json({message: 'Incorrect Old Password'});
      } else {
        sqlQuery = "UPDATE users SET password = ? WHERE email = ?";
        conn.query(sqlQuery, [user.new_password, email], (error, result) => {
          if(!error) {
            return res.status(200).json({message: "Password Updated Successfully"});
          } else {
            return res.status(500).json(error);
          }
        })
      }
    } else {
      return res.status(500).json(error);
    }
  })
});


module.exports = router;