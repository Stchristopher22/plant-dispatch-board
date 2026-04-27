import React from 'react';

const AIPriorityBar = ({ orders, onScrollToCard }) => {
    const urgentOrders = orders
        .filter(o => o.priority === 'high' && o.status !== 'Dispatched')
        .slice(0, 4);

    if (urgentOrders.length === 0) return null;

    const formatLeaveTime = (order) => {
        if (order.leaveHr) {
            return `${order.leaveHr}:${order.leaveMn || '00'} ${order.leaveAmPm || 'AM'}`;
        }
        return order.dispatchDate || 'No time';
    };

    return (
        <div className="ai-bar">
            <span className="ai-bar-label">🤖 AI Priority:</span>
            {urgentOrders.map(order => (
                <span
                    key={order._id}
                    className="ai-score-pill high"
                    onClick={() => onScrollToCard(order._id)}
                >
                    {order.orderNum || order.customer} — {formatLeaveTime(order)}
                </span>
            ))}
        </div>
    );
};

export default AIPriorityBar;