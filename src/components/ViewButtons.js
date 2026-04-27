import React from 'react';

const ViewButtons = ({ currentView, onViewChange }) => {
    return (
        <div className="view-btns">
            <button
                className={`view-btn ${currentView === 'date' ? 'active' : ''}`}
                onClick={() => onViewChange('date')}
            >
                📅 By Date
            </button>
            <button
                className={`view-btn ${currentView === 'team' ? 'active' : ''}`}
                onClick={() => onViewChange('team')}
            >
                👥 By Team
            </button>
        </div>
    );
};

export default ViewButtons;