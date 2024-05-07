import sendSMS from "../middlewares/sendSms.js";
import Contact from "../model/Contact.js";
import Lead from "../model/Lead.js";
import SMS from "../model/SMS.js";


const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    const newSMS = new SMS({
        sender: req.user.userId,
        // lead_id: '662a5c9bc17e94b2b0bb4441',
        // contact_id: '662a09815d5bd3c5b15a8a57',
        task_id: '662e1ad8bf8ae6c2c3031bdc',
        startTime: new Date(),
        receiver: "+254123456789",
        relatedTo: "Task",
        message: 'Hello, this is a test message.'
    });

    // // Save the new SMS record to the database
    // const savedSMS = await newSMS.save();

    let allData = await SMS.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $lookup: {
                from: "tasks",
                localField: "task_id",
                foreignField: "_id",
                as: "tasksData"
            }
        },
        {
            $lookup: {
                from: "contacts",
                localField: "contact_id",
                foreignField: "_id",
                as: "contactData"
            }
        },
        {
            $lookup: {
                from: "leads",
                localField: "lead_id",
                foreignField: "_id",
                as: "leadData"
            }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$leadData', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$contactData', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$tasksData', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                senderName: { $concat: ["$userData.firstName", " ", "$userData.lastName"] },
                reciverName: {
                    $cond: {
                        if: { $eq: ["$relatedTo", "Lead"] },
                        then: { $concat: ["$leadData.firstName", " ", "$leadData.lastName"] },
                        else: {
                            $cond: {
                                if: { $eq: ["$relatedTo", "Contact"] },
                                then: { $concat: ["$contactData.firstName", " ", "$contactData.lastName"] },
                                else: ""
                            }
                        }
                    }
                },
                reciverNumber: {
                    $cond: {
                        if: { $eq: ["$relatedTo", "Lead"] },
                        then: "$leadData.phoneNumber",
                        else: {
                            $cond: {
                                if: { $eq: ["$relatedTo", "Contact"] },
                                then: "$contactData.phoneNumber",
                                else: ""
                            }
                        }
                    }
                },
            }
        },
        {
            $project: {
                userData: 0,
                tasksData: 0,
                leadData: 0,
                contactData: 0
            }
        }
    ]);


    let totalRecords = allData.length
    res.send({ result: allData, total_recodes: totalRecords })
};

const contactSMS = async (req, res) => {
    try {
        const { ids, message } = req.body;
        const query = req.query;
        query._id = { $in: ids };
        query.deleted = false;
        let data = await Contact.find(query);

        const smsPromises = data.map(async (item) => {
            try {
                const smsSend = await sendSMS({ to: `+254${item.phoneNumber}`, message });

                if (smsSend && smsSend.status === 200) {
                    return { item, status: 'Delivered' };
                } else {
                    return { item, status: 'Failed', message: smsSend.message };
                }
            } catch (error) {
                console.error('Failed to send SMS:', error);
                return { item, status: 'Failed', message: error.message };
            }
        });

        const results = await Promise.all(smsPromises);

        for (const result of results) {
            const newSms = new SMS({ sender: req.user.userId, status: result.status, startTime: new Date(), relatedTo: 'Contact', message: result.message, contact_id: result.item._id, createdOn: new Date(), receiver: result.item.phoneNumber });
            await newSms.save();
        }

        const successRecds = results.filter(result => result.status === 'Delivered');
        const failedRecds = results.filter(result => result.status === 'Failed');

        if (successRecds && successRecds?.length <= 0) {
            return res.status(401).json({
                // message: `SMS send process executed. <br>Success Count: ${successRecds?.length} <br>Failed Count: ${failedRecds?.length}`,
                message: `SMS send process executed. Success Count: ${successRecds?.length} Failed Count: ${failedRecds?.length}`,
                errors: results.filter(result => result.status === 'Failed').map(result => result.message + "."),
                failedRecords: failedRecds,
                successRecords: successRecds
            });
        }

        return res.status(200).json({
            // message: `SMS send process executed. <br>Success Count: ${successRecds?.length} <br>Failed Count: ${failedRecds?.length}`,
            message: `SMS send process executed. Success Count: ${successRecds?.length} Failed Count: ${failedRecds?.length}`,
            errors: results.filter(result => result.status === 'Failed').map(result => result.message + "."),
            failedRecords: failedRecds,
            successRecords: successRecds
        });

    } catch (err) {
        console.error('Failed to send SMS :', err);
        res.status(500).json({ error: 'Failed to send SMS ' });
    }
};

const leadSMS = async (req, res) => {
    try {
        const { ids, message } = req.body;
        const query = { ...req.query, deleted: false, _id: { $in: ids } };
        let data = await Lead.find(query);

        const smsPromises = data.map(async (item) => {
            try {
                const smsSend = await sendSMS({ to: `+254${item.phoneNumber}`, message });

                if (smsSend && smsSend.status === 200) {
                    return { item, status: 'Delivered' };
                } else {
                    return { item, status: 'Failed', message: smsSend.message };
                }
            } catch (error) {
                console.error('Failed to send SMS:', error);
                return { item, status: 'Failed', message: error.message };
            }
        });

        const results = await Promise.all(smsPromises);

        // Update database after all SMS messages are sent
        for (const result of results) {
            const newSms = new SMS({ sender: req.user.userId, status: result.status, startTime: new Date(), relatedTo: 'Lead', message: result.message, lead_id: result.item._id, createdOn: new Date(), receiver: result.item.phoneNumber });
            await newSms.save();
        }

        const successRecds = results.filter(result => result.status === 'Delivered');
        const failedRecds = results.filter(result => result.status === 'Failed');

        if (successRecds && successRecds?.length <= 0) {
            return res.status(401).json({
                // message: `SMS send process executed. <br>Success Count: ${successRecds?.length} <br>Failed Count: ${failedRecds?.length}`,
                message: `SMS send process executed. Success Count: ${successRecds?.length} Failed Count: ${failedRecds?.length}`,
                errors: results.filter(result => result.status === 'Failed').map(result => result.message + "."),
                failedRecords: failedRecds,
                successRecords: successRecds
            });
        }

        return res.status(200).json({
            // message: `SMS send process executed. <br>Success Count: ${successRecds?.length} <br>Failed Count: ${failedRecds?.length}`,
            message: `SMS send process executed. Success Count: ${successRecds?.length} Failed Count: ${failedRecds?.length}`,
            errors: results.filter(result => result.status === 'Failed').map(result => result.message + "."),
            failedRecords: failedRecds,
            successRecords: successRecds
        });

    } catch (err) {
        console.error('Failed to send SMS:', err);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
};


export default { index, contactSMS, leadSMS }
