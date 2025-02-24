const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' }); // Added return
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' }); // Added return
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(400).json({ message: 'Invalid credentials' }); 

        res.status(200).json({ message: 'User logged in successfully' }); // Changed to 200 OK
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
