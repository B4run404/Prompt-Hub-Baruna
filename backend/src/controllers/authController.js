const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Controller mendelegasikan logika bisnis ke Service Layer
        const result = await authService.login(email, password);
        
        res.status(200).json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        console.error('Login error:', error.message);
        
        // Mapping error dari service ke HTTP Status Code
        if (error.message === 'EMAIL_PASSWORD_REQUIRED') {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login
};
