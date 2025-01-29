const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email ID already exists"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("INVALID EMAIL");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,  // ✅ Change to String to prevent leading zero truncation
        required: true
    },
    address: {
        type: String,
        required: true
    },
    grievances: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            dept: {
                type: String,
                required: true
            },
            grievance: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "Not seen"
            },
            feedback: {
                type: String,
                default: "NA"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });  // ✅ Adds `createdAt` and `updatedAt` timestamps automatically

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Generate authentication token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: "7d" }); // ✅ Expiry added
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (err) {
        console.error("Token generation error:", err);
    }
};

// Add grievance
userSchema.methods.addGrievance = async function (name, email, phone, dept, grievance) {
    try {
        this.grievances.push({ name, email, phone, dept, grievance });
        await this.save();
        return this.grievances;  // ✅ Return the updated grievances
    } catch (err) {
        console.error("Error adding grievance:", err);
    }
};

// Creating a collection
const User = mongoose.model('User', userSchema);

module.exports = User;
