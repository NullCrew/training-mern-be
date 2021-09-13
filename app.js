import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/landing-page');

// Create a Schema
const interestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    college: String,
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
});

// Linked the schema to a model -> Collection
const Interests = new mongoose.model('Interests', interestSchema);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// GET, POST, PUT, DELETE -> CRUD : Create, Read, Update, Delete
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/interests', async (req, res) => {
    // Store an interest
    const newInterest = new Interests({
        name: req.body.name,
        email: req.body.email,
        college: req.body.college,
        phone: req.body.phone,
    });

    try {
        await newInterest.save();
        res.json(newInterest);
    } catch (error) {
        if (error.code === 11000) {
            return res.json({
                error: {
                    message: "Your interest has already been registered. We'll get in touch with you shortly!"
                }
            })
        }
        res.json({
            service: 'mongoose',

            error: {
                message: 'Something went wrong!',
                ...error
            },
        })
    }
})

app.listen(1234, () => {
    console.log('Server is running on port 1234');
});