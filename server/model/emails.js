import mongoose from "mongoose"

const Email = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    receiver: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String },
    html: { type: String },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    status: { type: String, default: "Pandding" },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now }

})

export default mongoose.model('Email', Email)