const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A course must have a title'],
        trim: true,
        maxlength: [100, 'A course title must have less or equal than 100 characters'],
        minlength: [3, 'A course title must have more or equal than 3 characters']
    },
    description: {
        type: String,
        required: [true, 'A course must have a description'],
        trim: true,
        maxlength: [1000, 'A course description must have less or equal than 1000 characters']
    },
    image: {
        type: String,
        default: 'default-course.jpg'
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
        validate: {
            validator: function(val) {
                return val > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    price: {
        type: Number,
        required: [true, 'A course must have a price'],
        min: [0, 'Price must be greater than or equal to 0']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
},
{timestamps: true}
);
// Update the updatedAt timestamp before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Course', courseSchema);