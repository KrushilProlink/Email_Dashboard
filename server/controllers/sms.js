import mongoose from "mongoose";
import sendSMS from "../middlewares/sendSms.js";
import Contact from "../model/Contact.js";
import Lead from "../model/Lead.js";
import SMS from "../model/SMS.js";
import User from "../model/User.js";

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    const user = await User.findById(req.user.userId);
    if (user?.role !== "admin") {
        query.sender = mongoose.Types.ObjectId(req.user.userId);
    }
    console.log(query)

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

    allData = allData.sort((a, b) => b.createdOn - a.createdOn);

    let totalRecords = allData.length
    res.send({ result: allData, total_recodes: totalRecords })
};

// const contactSMS = async (req, res) => {
//     try {
//         const { ids, message } = req.body;
//         const query = req.query;
//         query._id = { $in: ids };
//         query.deleted = false;
//         let data = await Contact.find(query);

//         const smsPromises = data.map(async (item) => {
//             try {
//                 const smsSend = await sendSMS({ to: `+254${item.phoneNumber}`, message });

//                 if (smsSend && smsSend.status === 200) {
//                     return { item, status: 'Delivered' };
//                 } else {
//                     return { item, status: 'Failed', errorMessage: smsSend.message };
//                 }
//             } catch (error) {
//                 console.error('Failed to send SMS:', error);
//                 return { item, status: 'Failed', errorMessage: error.message };
//             }
//         });

//         const results = await Promise.all(smsPromises);

//         for (const result of results) {
//             const newSms = new SMS({
//                 sender: req.user.userId,
//                 status: result.status,
//                 startTime: new Date(),
//                 relatedTo: "Contact",
//                 message: message || "",
//                 errorMessage: result.errorMessage,
//                 contact_id: result.item._id,
//                 createdOn: new Date(),
//                 receiver: result.item.phoneNumber,
//             });
//             await newSms.save();
//         }

//         const successRecds = results.filter(result => result.status === 'Delivered');
//         const failedRecds = results.filter(result => result.status === 'Failed');

//         if (successRecds && successRecds?.length <= 0) {
//             return res.status(401).json({
//                 // message: `SMS send process executed. <br>Success: ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
//                 message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
//                 errors: results.filter(result => result.status === 'Failed').map(result => result.errorMessage + "."),
//                 failedRecords: failedRecds,
//                 successRecords: successRecds
//             });
//         }

//         return res.status(200).json({
//             // message: `SMS send process executed. <br>Success : ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
//             message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
//             errors: results.filter(result => result.status === 'Failed').map(result => result.errorMessage + "."),
//             failedRecords: failedRecds,
//             successRecords: successRecds
//         });

//     } catch (err) {
//         console.error('Failed to send SMS :', err);
//         res.status(500).json({ error: 'Failed to send SMS ' });
//     }
// };

const contactSMS = async (req, res) => {
    try {
        const { ids, message } = req.body;
        const query = { ...req.query, deleted: false, _id: { $in: ids } };

        let contactData = await Contact.find(query);

        const phoneNumbers = contactData?.map(contact => `254${contact?.phoneNumber}`).join(',');

        const smsSendResults = await sendSMS({ senderId: process.env.CLOUDREBUE_SMS_SENDER, phone: phoneNumbers, MessageEvent });

        for (const [index, result] of smsSendResults.entries()) {
            const newSms = new SMS({
                sender: req?.user?.userId,
                status: result?.status === true ? 'Delivered' : 'Failed',
                startTime: new Date(),
                relatedTo: "Contact",
                message: message || "",
                errorMessage: result?.status !== true ? result?.message : '',
                contact_id: contactData?.[index]._id,
                createdOn: new Date(),
                receiver: result.phone,
            });
            await newSms.save();
        }

        const successRecds = smsSendResults.filter(result => result.status === true);
        const failedRecds = smsSendResults.filter(result => result.status === false);

        if (successRecds && successRecds?.length <= 0) {
            return res.status(401).json({
                // message: `SMS send process executed. <br>Success: ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
                message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
                errors: smsSendResults.filter(result => result?.status === false).map(result => result?.message + "."),
                failedRecords: failedRecds,
                successRecords: successRecds
            });
        }

        return res.status(200).json({
            // message: `SMS send process executed. <br>Success: ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
            message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
            errors: smsSendResults.filter(result => result?.status === false).map(result => result?.message + "."),
            failedRecords: failedRecds,
            successRecords: successRecds
        });

    } catch (err) {
        console.error('Failed to send SMS:', err);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
};

const leadSMS = async (req, res) => {
    try {
        const { ids, message } = req.body;
        const query = { ...req.query, deleted: false, _id: { $in: ids } };

        let leadData = await Lead.find(query);

        const phoneNumbers = leadData?.map(contact => `254${contact?.phoneNumber}`).join(',');
        const smsSendResults = await sendSMS({ senderId: process.env.CLOUDREBUE_SMS_SENDER, phone: phoneNumbers, message });

        for (const [index, result] of smsSendResults.entries()) {
            const newSms = new SMS({
                sender: req?.user?.userId,
                status: result?.status === true ? 'Delivered' : 'Failed',
                startTime: new Date(),
                relatedTo: "Lead",
                message: message || "",
                errorMessage: result?.status !== true ? result?.message : '',
                lead_id: leadData?.[index]._id,
                createdOn: new Date(),
                receiver: result.phone,
            });
            await newSms.save();
        }

        const successRecds = smsSendResults.filter(result => result.status === true);
        const failedRecds = smsSendResults.filter(result => result.status === false);

        if (successRecds && successRecds?.length <= 0) {
            return res.status(401).json({
                // message: `SMS send process executed. <br>Success: ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
                message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
                errors: smsSendResults.filter(result => result?.status === false).map(result => result?.message + "."),
                failedRecords: failedRecds,
                successRecords: successRecds
            });
        }

        return res.status(200).json({
            // message: `SMS send process executed. <br>Success: ${successRecds?.length} <br>Failed: ${failedRecds?.length}`,
            message: `SMS send process executed. Success: ${successRecds?.length} Failed: ${failedRecds?.length}`,
            errors: smsSendResults.filter(result => result?.status === false).map(result => result?.message + "."),
            failedRecords: failedRecds,
            successRecords: successRecds
        });

    } catch (err) {
        console.error('Failed to send SMS:', err);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
};

const view = async (req, res) => {
    let sms = await SMS.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                as: "userData"
            }
        },
        {
            $lookup: {
                from: "leads",
                foreignField: "_id",
                localField: "lead_id",
                as: "leadData"
            }
        },
        {
            $lookup: {
                from: "contacts",
                foreignField: "_id",
                localField: "contact_id",
                as: "contactData"
            }
        },
        {
            $lookup: {
                from: "tasks",
                foreignField: "_id",
                localField: "task_id",
                as: "tasksData"
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
    res.status(200).json({ sms })
}

export default { index, contactSMS, leadSMS, view }
