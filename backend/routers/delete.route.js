const express = require("express");
const router = express.Router();
const {
  deleteContent,
} = require("../controllers/delete.controller");

// Delete story or appended content
router.post("/content/:contentId", deleteContent);

module.exports = router;