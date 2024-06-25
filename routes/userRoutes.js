import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            username,
            password: hashedPassword
        });
        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid');
        }

        user.last_login_date = Date.now();
        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Error", error);
        res.status(500).send('Error');
    }
});


export default router;
