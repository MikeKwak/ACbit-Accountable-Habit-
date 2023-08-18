import React, { useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar/Calendar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../contexts/UserContext';

const CustomPrevButton = () => <FontAwesomeIcon icon={faArrowLeft} />;
const CustomNextButton = () => <FontAwesomeIcon icon={faArrowRight} />;

const MonthlyCalendar: React.FC = () => {
    const { user } = useContext(UserContext);

    const renderTileContent = ({ date, view }: any) => {
        if (view !== 'month') {
            return null;
        }

        const matchingTask = user!.taskData.find(task => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getFullYear() === date.getFullYear() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getDate() === date.getDate()
            );
        });
        
        const tasksCompleted = matchingTask ? matchingTask.tasksCompleted : 0;

        const color = calculateColor(tasksCompleted);

        return <div className={`day-tile ${color}`}>{date.getDate()}</div>;
    };

    const calculateColor = (tasksCompleted: number) => {
        if (tasksCompleted === 0) {
            return 'cyan0';
        } else if (tasksCompleted <= 1) {
            return 'cyan1';
        }else if (tasksCompleted <= 2) {
            return 'cyan2';
        }
        else if (tasksCompleted <= 3) {
            return 'cyan3';
        }
        else if (tasksCompleted <= 4) {
            return 'cyan4';
        }
        else if (tasksCompleted <= 5) {
            return 'cyan5';
        } 
        else {
            return 'cyan6';
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
                showNeighboringMonth={true}
            />
        </div>
    );
};

export default MonthlyCalendar;
