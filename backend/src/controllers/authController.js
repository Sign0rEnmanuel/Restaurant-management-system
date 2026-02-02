import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJSON, writeJSON } from '../utils/fileHandler.js';

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res
                .status(400)
                .json({ message: 'Missing required fields' });
        }
        if (role !== 'admin' && role !== 'operador') {
            return res
                .status(400)
                .json({ message: 'Invalid role' });
        }

        const users = await readJSON('users.json');
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res
                .status(400)
                .json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        await writeJSON('users.json', users);

        res
            .status(201)
            .json({ 
                message: 'User created successfully', 
                user: { id: newUser.id, username: newUser.username, role: newUser.role }
            });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Missing required fields' });
        }

        const users = await readJSON('users.json');
        const user = users.find(user => user.username === username);
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res
            .status(200)
            .json({
                message: 'Login successful',
                token: `Bearer ${token}`,
                user: { id: user.id, username: user.username, role: user.role },
            });

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};