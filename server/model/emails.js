import mongoose from "mongoose"

const Email = new mongoose.Schema({
    // sender: { type: String, required: true },
    sender: { 
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
     },
    receiver: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String },
    html: { type: String },
    lead_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Lead",
        default: null
    },
    contact_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Contact",
        default: null
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now }

})

export default mongoose.model('Email', Email)