import React from 'react';
import { formatDate, getNext7Days } from '../services/utils';

const DayTabs = ({ orders, activeDay, onDayChange }) => {
    const today = new Date().toISOString().slice(0, 10);
    const days = getNext7Days();

    const getOrderCount = (date) => {
        return orders.filter(o => o.orderDate === date).length;
    };

    return (
        <div className="day-tabs">
            <button
                className={`day-tab ${activeDay === 'all' ? 'active' : ''}`}
                onClick={() => onDayChange('all')}
            >
                All
            </button>
            {days.map(day => {
                const count = getOrderCount(day);
                const label = day === today ? 'Today' : formatDate(day);
                return (
                    <button
                        key={day}
                        className={`day-tab ${activeDay === day ? 'active' : ''}`}
                        onClick={() => onDayChange(day)}
                    >
                        {label}{count ? ` (${count})` : ''}
                    </button>
                );
            })}
        </div>
    );
};

export default DayTabs;