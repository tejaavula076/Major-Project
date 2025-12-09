const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("I am the user root")
})

router.post("/:id/post", (req, res) => {
    res.send("I am the user ")
})

router.put("/:id/put", (req, res) => {
    res.send("I am editing the user")
})
router.delete("/:id/delete", (req, res) => {
    res.send("I am deleting the user")
})
module.exports = router;