import React, { useState } from 'react';
import ExportModal from './ExportModal';

const Header = ({ searchQuery, onSearchChange, onAddOrder, orders, syncStatus }) => {
    const [showExportModal, setShowExportModal] = useState(false);

    return (
        <>
            <header>
                <div>
                    <h1>🌿 Plant Centre Dispatch Board</h1>
                    <div className="from-loc">
                        📍 From: Plant Centre, Moola Chatram, Selaivayal, Chennai 600051
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Search order / customer / location..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onAddOrder}>+ Add Order</button>
                    <button className="btn-export" onClick={() => setShowExportModal(true)}>
                        📎 Export Report
                    </button>
                </div>
                <div className={`sync-status ${syncStatus.status}`}>
                    <span>{syncStatus.icon}</span>
                    <span>{syncStatus.text}</span>
                </div>
            </header>
            
            <ExportModal 
                isOpen={showExportModal} 
                onClose={() => setShowExportModal(false)} 
                orders={orders}
            />
        </>
    );
};

export default Header;