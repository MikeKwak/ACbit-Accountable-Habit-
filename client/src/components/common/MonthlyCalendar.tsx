import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Calendar.scss'; // Import your custom CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const CustomPrevButton = () => <FontAwesomeIcon icon={faArrowLeft} />;
const CustomNextButton = () => <FontAwesomeIcon icon={faArrowRight} />;

const MonthlyCalendar: React.FC = () => {
    //turn into state
    const taskData = [
        { date: new Date(2023, 5, 1), tasksCompleted: 2 },
        { date: new Date(2023, 5, 5), tasksCompleted: 5 },
    ];

    const renderTileContent = ({ date, view }: any) => {
        if (view !== 'month') {
            return null;
        }

        const tasksCompleted = taskData.reduce(
            (count, task) =>
                task.date.getFullYear() === date.getFullYear() &&
                task.date.getMonth() === date.getMonth() &&
                task.date.getDate() === date.getDate()
                    ? count + task.tasksCompleted
                    : count,
            0,
        );

        const color = calculateColor(tasksCompleted);

        return <div className={`day-tile ${color}`}>{date.getDate()}</div>;
    };

    const calculateColor = (tasksCompleted: number) => {
        if (tasksCompleted === 0) {
            return 'low';
        } else if (tasksCompleted <= 3) {
            return 'medium';
        } else {
            return 'high';
        }
    };

    return (
        <div className="calendar-container">
            <Calendar
                view="month"
                tileContent={renderTileContent}
                calendarType="US"
                prevLabel={<CustomPrevButton />}
                nextLabel={<CustomNextButton />}
                selectRange={false}
                showNeighboringMonth={false}
            />
        </div>
    );
};

export default MonthlyCalendar;
