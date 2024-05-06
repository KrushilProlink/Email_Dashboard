import mongoose from "mongoose"

const SMS = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    status: { type: String, default: "Sending" }, // Delivered, Rejected, Failed
    startTime: { type: String, required: true },
    // receiver: { type: String, required: true },
    relatedTo: { type: String, required: true },
    message: { type: String, required: true },
    task_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Tasks"
    },
    lead_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Lead"
    },
    contact_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Contact"
    },

    deleted: {
        type: Boolean,
        default: false,
    },
    createdOn: { type: Date },
    modifiedOn: { type: Date, default: Date.now }
})

export default mongoose.model('Sms', SMS)