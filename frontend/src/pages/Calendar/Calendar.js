/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActionButtonTwo from '../../components/ActionButtonTwo';
import AddCall from '../../components/call/Addcalls';
import AddMeeting from '../../components/meeting/Addmeetings';
import AddTask from '../../components/task/AddTask';
import { fetchCalendarData } from '../../redux/slice/calendarSlice';

const Calendar = () => {
    const [userAction, setUserAction] = useState(null)
    const [taskId, setTaskId] = useState('')
    const [openTask, setOpenTask] = useState(false);
    const [openMeeting, setOpenMeeting] = useState(false);
    const [openCall, setOpenCall] = useState(false);
    const [openViewEdit, setOpenViewEdit] = useState(false)
    const dispatch = useDispatch()
    const userid = localStorage.getItem('user_id')
    const userRole = localStorage.getItem("userRole")

    const { data, isLoading } = useSelector((state) => state?.calendarDetails)

    // open task model
    const handleOpenTask = () => setOpenTask(true);
    const handleCloseTask = () => setOpenTask(false);

    // open meeting model
    const handleOpenMeeting = () => setOpenMeeting(true);
    const handleCloseMeeting = () => setOpenMeeting(false);

    // open call model
    const handleOpenCall = () => setOpenCall(true);
    const handleCloseCall = () => setOpenCall(false);

    const handleOpenViewEdit = () => setOpenViewEdit(true)
    const handleCloseViewEdit = () => setOpenViewEdit(false)

    const handleDateSelect = (selectInfo) => {
        handleCloseTask();
    };

    const handleEventClick = (clickInfo) => {
        setTaskId(clickInfo?.event?._def?.extendedProps?._id)
        handleOpenViewEdit()
        if (clickInfo.event.url) {
            clickInfo.jsEvent.preventDefault();
            window.open(clickInfo.event.url);
        }

    };
    const handleEvents = (events) => {
    };

    const renderEventContent = (eventInfo) => (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );


    useEffect(() => {
        dispatch(fetchCalendarData());
    }, [userAction])

    return (
        <div>
            {/* Add Task Model */}
            <AddTask open={openTask} handleClose={handleCloseTask} setUserAction={setUserAction} lead='lead' contact='contact' />

            {/* View Edit Model */}
            {/* <ViewEdit open={openViewEdit} handleClose={handleCloseViewEdit} id={taskId} deletedata={deletedata} lead='lead' contact='contact' setUserAction={setUserAction} fetchEvent={fetchdata} /> */}

            {/* Add Meeting Model */}
            <AddMeeting open={openMeeting} handleClose={handleCloseMeeting} setUserAction={setUserAction} />

            {/* Add Call Model */}
            <AddCall open={openCall} handleClose={handleCloseCall} setUserAction={setUserAction} />

            <Container maxWidth>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">
                        Calendar
                    </Typography>
                    <ActionButtonTwo
                        handleOpenTask={handleOpenTask}
                        handleOpenMeeting={handleOpenMeeting}
                        handleOpenCall={handleOpenCall}
                    />
                </Stack>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', height: "600px" }}>
                        <span className="loader" />
                    </div>
                ) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        minHeight="400px"
                        height="600px"
                        // dateClick={handleDateClick}
                        // events={calendarDataCalendar}
                        events={data}

                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        eventClick={handleEventClick}
                        eventsSet={handleEvents}
                        select={handleDateSelect}
                        eventContent={renderEventContent}
                        views={{
                            listWeek: { buttonText: 'List' },
                            multiMonthFourMonth: {
                                type: 'multiMonth',
                                buttonText: 'multiMonth',
                                duration: { months: 4 },
                            }
                        }}
                        buttonText={{
                            today: 'Today',
                            dayGridMonth: 'Month',
                            timeGridWeek: 'Week',
                            timeGridDay: 'Day',
                        }}
                        eventClassNames="custom-fullcalendar"
                    />
                )}

            </Container>
        </div>
    );

};

export default Calendar;
