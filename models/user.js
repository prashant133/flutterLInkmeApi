const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    // contactNumber: {
    //     type: String,
    //     required: true,
    //     unique: true

    // },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    // image: {
    //     type: String,
    //     default: null,

    // },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

});
userSchema.set('toJSON', {
    transform: (document, returnDocument) => {
        returnDocument.id = document._id.toString(),
            delete returnDocument._id;
        delete returnDocument.__v;
        delete password;


    }
});
module.exports = new mongoose.model('User', userSchema)