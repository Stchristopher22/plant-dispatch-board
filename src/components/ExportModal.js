import React, { useState } from 'react';
import { exportToExcel, exportToPDF, exportToCSV, exportToJSON } from '../services/exportServiceCDN';

const ExportModal = ({ isOpen, onClose, orders, allOrders }) => {
    const [exportType, setExportType] = useState('excel');
    const exportOrders = orders && orders.length > 0 ? orders : (allOrders || []);

    if (!isOpen) return null;

    const handleExport = () => {
        if (exportOrders.length === 0) {
            alert('No orders to export!');
            return;
        }
        
        switch (exportType) {
            case 'excel':
                exportToExcel(exportOrders);
                break;
            case 'pdf':
                exportToPDF(exportOrders);
                break;
            case 'csv':
                exportToCSV(exportOrders);
                break;
            case 'json':
                exportToJSON(exportOrders);
                break;
            default:
                exportToExcel(exportOrders);
        }
        onClose();
    };

    return (
        <div className="modal-bg open" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📎 Export Report</h2>
                </div>
                
                <div className="modal-body">
                    <div className="sec-div">Select Export Format</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        <label className="cbrow" style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="exportType" 
                                value="excel" 
                                checked={exportType === 'excel'} 
                                onChange={() => setExportType('excel')}
                            />
                            <span>📊 Excel (.xlsx) - Best for data analysis</span>
                        </label>
                        
                        <label className="cbrow" style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="exportType" 
                                value="pdf" 
                                checked={exportType === 'pdf'} 
                                onChange={() => setExportType('pdf')}
                            />
                            <span>📄 PDF (.pdf) - Professional report</span>
                        </label>
                        
                        <label className="cbrow" style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="exportType" 
                                value="csv" 
                                checked={exportType === 'csv'} 
                                onChange={() => setExportType('csv')}
                            />
                            <span>📋 CSV (.csv) - Universal format</span>
                        </label>
                        
                        <label className="cbrow" style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio" 
                                name="exportType" 
                                value="json" 
                                checked={exportType === 'json'} 
                                onChange={() => setExportType('json')}
                            />
                            <span>🔧 JSON (.json) - Data backup</span>
                        </label>
                    </div>
                    
                    <div className="pri-hint" style={{ display: 'block', marginTop: '10px' }}>
                        📊 Total orders to export: <strong>{exportOrders.length}</strong>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleExport}>
                        📥 Export as {exportType.toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;