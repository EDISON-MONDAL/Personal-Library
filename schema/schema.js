const mongoose = require('mongoose')

const dbSchema = new mongoose.Schema({
    title: { type: String, required: true},
    comments: [String]
})



module.exports = mongoose.model('bookList', dbSchema)