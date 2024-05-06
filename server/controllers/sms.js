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
}

export default { index }
