let express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.send("I am the post root")
})

router.post("/:id/post", (req, res) => {
    res.send("I am the post post")
})

router.put("/:id/put", (req, res) => {
    res.send("I am editing the post")
})
router.delete("/:id/delete", (req, res) => {
    res.send("I am deleting the post")
})
module.exports = router;