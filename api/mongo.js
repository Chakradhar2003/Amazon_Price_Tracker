// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://amazon:amazon@amazon.yfsnm.mongodb.net/?retryWrites=true&w=majority&appName=Amazon', { useNewUrlParser: true, useUnifiedTopology: true });

// Create ASIN Schema
const asinSchema = new mongoose.Schema({
    asin: { type: String, required: true },
});

const Asin = mongoose.model('Asin', asinSchema);

app.use(cors());
app.use(express.json());

// POST: Add ASIN to DB
app.post('/api/asins', async (req, res) => {
    const { asin } = req.body;
    try {
        const newAsin = new Asin({ asin });
        await newAsin.save();
        res.json(newAsin);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET: Retrieve all ASINs
app.get('/api/asins', async (req, res) => {
    try {
        const asins = await Asin.find();
        res.json(asins);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
