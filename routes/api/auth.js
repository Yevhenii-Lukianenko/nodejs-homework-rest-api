const express = require("express");
const router = express.Router();

const user = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");

router.post("/register", user.register);

router.post("/login", user.login);

router.get("/current", authenticate, user.getCurrent);

router.post("/logout", authenticate, user.logout);

router.patch("/users/subscription", authenticate, user.updateSubscriptionUser);

module.exports = router;
