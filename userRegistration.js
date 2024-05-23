const express = require('express');
const app = express();
const zod = require('zod');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Establish connection to MongoDB
const connection = mongoose.connect('mongodb://localhost:27017/');
connection.then(() => {
    console.log("Database Connection Done !!!");
}).catch(() => {
    console.log("Connection Failed ");
});

// Define the structure of the collection
const collectionStructure = {
    Name: String,
    Email: String,
    Password: String
};

// Define schema for data validation
const schema = zod.object({
    Name: zod.string(),
    Email: zod.string().email(),
    Password: zod.string().min(8)
});

// Define Mongoose model
const User = mongoose.model('Developer', collectionStructure);

// Variable to track registration status
let results;

// Endpoint to handle user registration
app.post('/', async(req, res) => {
    let result;
    const { Name, Email, Password } = req.body;

    // Validate request body
    const response = schema.safeParse({ Name, Email, Password });

    if (response.success) {
        // If validation succeeds, create a new user
        const varify=await User.findOne({Email:Email});
        if(varify){
            res.send("Email Already Used");
        }
        else{
            const user = new User({ Name: Name, Email: Email, Password: Password });
            result = user.save();

        }
        
    }

    // Handle registration result
    result.then(() => {
        // Registration successful
        results = true;
        res.send("Registration successful");
    }).catch(() => {
        // Registration failed
        results = false;
        res.send("Failed Registration");
    });
});

// Endpoint to check registration status
app.get('/register', (req, res) => {
    if (results == true) {
        // Registration completed successfully
        res.send("Registration Done");
    } else if (results == null) {
        // Registration process not completed
        res.send("Registration Process UnDone");
    } else {
        // Registration failed
        res.send("Registration failed");
    }
});

// Start the server
app.listen(5000);
