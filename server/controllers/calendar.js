import Tasks from '../model/Tasks.js'
import Calls from '../model/Calls.js'
import Meetings from '../model/Meetings.js'

const index = async (req, res) => {
    try {
        const query = req.query
        query.deleted = false;

        const [taskData, callData, meetingData] = await Promise.all([
            Tasks.find(query),
            Calls.find(query),
            Meetings.find(query)
        ]);

        const taskList = taskData.map(item => ({
            id: item._id,
            title: item.subject,
            start: item.startDate,
            end: item.endDate,
            textColor: item.textColor,
            backgroundColor: item.backgroundColor,
            groupId: "task"
        }));

        const callList = callData.map(item => ({
            id: item._id,
            title: item.subject,
            start: item.startDateTime,
            backgroundColor: "green",
            groupId: "call"
        }));

        const meetingList = meetingData.map(item => ({
            id: item._id,
            title: item.subject,
            start: item.startDate,
            end: item.endDate,
            backgroundColor: "red",
            groupId: "meeting"
        }));

        const result = [...taskList, ...callList, ...meetingList];
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default { index }