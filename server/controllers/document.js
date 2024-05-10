import Document from "../model/document.js";
import User from "../model/User.js";

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;

    const user = await User.findById(req.user.userId);
    if (user?.role !== "admin") {
        delete query.createdBy;
        query.$or = [{ createdBy: req.user.userId }, { assignTo: { $in: [req.user.userId] } }];
    }

    let allData = await Document.find(query).populate({
        path: 'createdBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec();

    let result = allData.filter(item => item.createdBy !== null);
    result = result.sort((a, b) => b.createdOn - a.createdOn);

    let totalRecords = result.length
    res.send({ result, total_recodes: totalRecords })
}

const fileUpload = async (req, res) => {
    const { fileName, assignTo, createdBy } = req.body;

    try {
        const file = await Document.create({ path: req.file.path, file: req.file.originalname, fileName: fileName, createdBy: createdBy, assignTo: assignTo });
        res.status(200).json({ file, message: "File uploaded successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

const downloadFile = async (req, res) => {
    try {
        const file = await Document.findById(req.params.fileId);
        file.downloadCount++;

        await file.save();

        res.download(file.path, file.name);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: error.message });
    }
}

const deleteData = async (req, res) => {
    try {
        let document = await Document.findByIdAndUpdate({ _id: req.params.id }, { deleted: true })
        res.status(200).json({ message: "File deleted successfully", document })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const documentIdsToDelete = req.body;

        const deleteManyDocumnets = await Document.updateMany({ _id: { $in: documentIdsToDelete } }, { deleted: true });

        if (deleteManyDocumnets.deletedCount === 0) {
            return res.status(404).json({ message: "Documents not found." });
        }

        res.status(200).json({ message: "Documents  deleted successfully.", deleteManyDocumnets });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Documents.", error: err.message });
    }
};

const assignToUpdates = async (req, res) => {
    try {
        const { documentId, assignTo } = req.body;

        const result = await Document.updateOne({ _id: documentId }, { $set: { assignTo: assignTo } }, { new: true });

        res.status(200).json({ success: true, message: "Successfully assigned", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error during assigning documents.", error: err.message });
    }
}

export default { index, fileUpload, downloadFile, deleteData, deleteMany, assignToUpdates }