// * Install the packages and import them 
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// * Connect to the database -> Localhost at port 27017
mongoose.connect('mongodb://127.0.0.1:27017/landing-page');

// * Create a Schema
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

// * Linked the schema to a model -> Collection
const Interests = new mongoose.model('Interests', interestSchema);

// * Initialize the express app
const app = express();

// * Tell express to use bodyParser _(allows us to get the data from a POST)_ -> Json, URL Encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// * Tell app to allow requests from anywhere
app.use(cors());

// * Add a test route
// GET, POST, PUT, DELETE -> CRUD : Create, Read, Update, Delete
app.get('/', (req, res) => {
    res.send('Hello World');
});

// * Create and store user interest
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

// * Tell express to listen on the port 1234
app.listen(1234, () => {
    console.log('Server is running on port 1234');
});