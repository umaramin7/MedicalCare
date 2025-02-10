// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Your Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes for other pages
app.get('/hospital-locator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hospital-locator.html'));
});

app.get('/emergency-portal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'emergency-portal.html'));
});

app.get('/symptom-checker', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'symptom-checker.html'));
});

// Twilio API endpoint
app.post('/api/send-sos', async (req, res) => {
    try {
        const { phone, location, name } = req.body;
        
        const message = await client.messages.create({
            body: `EMERGENCY SOS from Emergency Portal App!\n\n${name} needs immediate assistance!\nLocation: https://www.google.com/maps?q=${location.latitude},${location.longitude}\n\nThis is an automated emergency message. Please respond immediately.`,
            from: twilioPhone,
            to: phone
        });

        res.json({ success: true, messageId: message.sid });
    } catch (error) {
        console.error('Twilio Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send SOS message' 
        });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});