import mongoose from "mongoose"

const Payment = new mongoose.Schema({
    orderId: { type: String, required: true },
    merchantRequestId: { type: String },
    checkoutRequestId: { type: String },
    responseCode: { type: Number },
    responseDescription: { type: String },
    customerMessage: { type: String },
    senderPhoneNumber: { type: String, required: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    mpesaReceiptNumber: { type: String },
    transactionDate: { type: Date },
    emailAddress: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    errorCode: { type: String },
    errorMessage: { type: String }
})

export default mongoose.model('Payment_details', Payment);