const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://root:root@cluster0.5nij53p.mongodb.net/`;

const connectTodatabase = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('connected to mongodb');
    } catch (error) {
        console.log(error)
    }

}

module.exports = connectTodatabase;