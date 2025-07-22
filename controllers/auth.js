const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user.js")

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
})

router.post('/sign-up', async (req,res) => {
    const userInDatabase = await User.findOne({ username: req.body.username});
    if (userInDatabase) {
        return res.send("username already taken.")
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password & Confirmation much match!");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        // why does something new = hashedPassword when it's a 'const' in previous line?

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`)
})

router.get('/sign-in', (req, res) => {
    res.render("auth/sign-in.ejs");
})

router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.")
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if(!validPassword) {
        return res.send("Login failed. Please try again.")
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
    }

    //res.send("Request to sign in received!")
    res.redirect("/");
})

router.get("/sign-out", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router;