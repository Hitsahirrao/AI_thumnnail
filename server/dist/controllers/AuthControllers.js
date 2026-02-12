import User from '../models/User.js';
import bcrypt from 'bcrypt';
//Controler fro user Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //find user by email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        //setting userdata in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id.to_string();
        return res.json({
            message: 'Account Created Successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invaild email or password' });
        }
        //setting userdata in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        return res.json({
            message: 'Login Successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
///controllers for user logout
export const logoutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });
    return res.json({ message: 'Logout successful' });
};
//controllers for user verify
export const verifyUser = async (req, res) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message });
    }
};
