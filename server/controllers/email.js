import Emails from '../model/emails.js'
import sendMail from '../middlewares/sendMail.js'

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;


    let allData = await Emails.find(query)
        .populate({
            path: 'createdBy',
            match: { deleted: false }, // Populate only if createBy.deleted is false
            select: 'firstName lastName'
        })
        .populate("sender", ["emailAddress"])
        .exec();


    let result = allData.filter(item => item.createdBy !== null);
    result = result.sort((a, b) => b.createdOn - a.createdOn);

    let totalRecords = result.length
    res.send({ result, total_recodes: totalRecords })
}

const add = async (req, res) => {
    try {
        if (!req.body.message && !req.body.html) {
            return res.status(400).json({ success: false, message: "message or html is required." });
        }

        if (!req.body.sender || !req.body.receiver) {
            return res.status(400).json({ success: false, message: "sender or receiver is missing." });
        }

        const { receiver, subject, message, html, sender, createdBy } = req.body;
        const emails = new Emails({ receiver, sender, subject, message, html, createdBy });
        await emails.save();

        await sendMail(receiver, subject, message || html);

        res.status(201).json({ success: true, email: emails, message: 'Email saved successfully' });
    } catch (err) {
        console.error('Failed to create Email:', err);
        res.status(500).json({ success: false, error: 'Failed to create Email', message: err.message });
    }
}

const view = async (req, res) => {
    let emails = await Emails.findOne({ _id: req.params.id })
        .populate("createdBy", ["firstName", "lastName"])
        .populate("sender", ["emailAddress"])

    if (!emails) return res.status(404).json({ message: "no Data Found." })
    res.status(200).json({ emails })
}

const deleteData = async (req, res) => {
    try {
        let emails = await Emails.findByIdAndUpdate({ _id: req.params.id }, { deleted: true })
        res.status(200).json({ message: "Email deleted successfully", emails })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const emailIdsToDelete = req.body;

        const deleteManyEmails = await Emails.updateMany({ _id: { $in: emailIdsToDelete } }, { deleted: true });

        if (deleteManyEmails.deletedCount === 0) {
            return res.status(404).json({ message: "Emails(s) not found." });
        }

        res.status(200).json({ message: "Emails deleted successfully", deleteManyEmails });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Emails ", error: err.message });
    }
}

export default { index, add, view, deleteData, deleteMany }