const { Router } = require("express");

const router = Router();

router.get("/status", (req, res) => {
  res.json({
    status: "Working.",
  });
});

module.exports = router;
