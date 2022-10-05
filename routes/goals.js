const express = require("express");
const conn = require("../connection");
const router = express.Router();
require("dotenv").config();

const auth = require("../services/auth");

// API ROUTES
router.post('/create-goal', auth.authToken, (req, res, next) => {
  let goals = {
    name: req.body.name,
    desc: req.body.desc,
    reason: req.body.reason,
    target_date: req.body.target_date,
    date_completed: req.body.date_completed
  }
  let sqlQuery = "INSERT INTO career_goals (name, description, reason, target_date, date_completed) VALUES (?, ?, ?, ?, ?)";
  conn.query(sqlQuery, [goals.name, goals.desc, goals.reason, goals.target_date, goals.date_completed], (error, result) => {
    if(!error) {
      return res.status(200).json({message: "New career goals added to your list"});
    } else {
      return res.status(500).json(error);
    }
  });
});

router.get('/career-list', auth.authToken, (req, res, next) => {
  let sqlQuery = "SELECT * FROM career_goals ORDER BY target_date";
  conn.query(sqlQuery, (error, result) => {
    if(!error) {
      return res.status(200).json(result);
    }else {
      return res.status(500).json(error);
    }
  })
});


router.get('/career/:id', auth.authToken, (req, res, next) => {
  let id = req.params.id;
  let sqlQuery = "SELECT * FROM career_goals WHERE id = ?";
  conn.query(sqlQuery, [id], (error, result) => {
    if(!error) {
      return res.status(200).json(result);
    }else {
      return res.status(500).json(error);
    }
  })
});


router.put('/update-career', auth.authToken, (req, res, next) => {
  let goals = {
    id: req.body.id,
    name: req.body.name,
    desc: req.body.desc,
    reason: req.body.reason,
    target_date: req.body.target_date,
    date_completed: req.body.date_completed
  }
  let sqlQuery = "UPDATE career_goals SET name = ?, description = ?, reason = ?, target_date = ?, date_completed = ? WHERE id = ?";
  conn.query(sqlQuery, [goals.name, goals.desc, goals.reason, goals.target_date, goals.date_completed, goals.id], (error, result) => {
    if(!error) {
      if(result.affectedRows == 0) {
        return res.status(404).json({ message: "Career goals not found !"});
      }
      return res.status(200).json({ message: "Updated Successfully !"});
    } else {
      return res.status(500).json(error);
    }
  });
});


router.post('/delete-career', auth.authToken, (req, res, next) => {
  let id = req.body.id;
  let sqlQuery = "DELETE FROM career_goals WHERE id = ?";
  conn.query(sqlQuery, [id], (error, result) => {
    if(!error) {
      if(result.affectedRows == 0) {
        return res.status(404).json({ message: "Career goals not found !"});
      }
      return res.status(200).json({ message: "Deleted Successfully"});
    } else {
      return res.status(500).json(error);
    }
  })
})


module.exports = router;




