import React from 'react';

const StatsBar = ({ orders }) => {
    const total = orders.length;
    const urgent = orders.filter(o => o.priority === 'high').length;
    const totalPlants = orders.reduce((a, o) => a + (parseInt(o.qty) || 0), 0);
    const tagPending = orders.filter(o => o.tags && !o.tagDone).length;
    const locPending = orders.filter(o => o.location && !o.locSorted).length;
    const readyDone = orders.filter(o => o.status === 'Dispatched' || o.status === 'Ready to Dispatch').length;

    return (
        <div className="stats">
            <div className="stat">
                <div className="val">{total}</div>
                <div className="lbl">Orders</div>
            </div>
            <div className="stat c-red">
                <div className="val">{urgent}</div>
                <div className="lbl">Urgent</div>
            </div>
            <div className="stat">
                <div className="val">{totalPlants}</div>
                <div className="lbl">Total plants</div>
            </div>
            <div className="stat c-purple">
                <div className="val">{tagPending}</div>
                <div className="lbl">Tags pending</div>
            </div>
            <div className="stat c-blue">
                <div className="val">{locPending}</div>
                <div className="lbl">Location TBC</div>
            </div>
            <div className="stat c-green">
                <div className="val">{readyDone}</div>
                <div className="lbl">Ready/done</div>
            </div>
        </div>
    );
};

export default StatsBar;