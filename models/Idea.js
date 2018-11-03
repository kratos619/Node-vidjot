const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// create Schema

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    data: {
        type: String,
        default: Date.now
    }
});

mongoose.model('idea', IdeaSchema)