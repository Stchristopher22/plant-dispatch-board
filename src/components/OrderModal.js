import React, { useState, useEffect } from 'react';
import { formatDateForInput, calculateAIScore, calculateDistance, getPriorityLabel } from '../services/utils';

const OrderModal = ({ isOpen, onClose, onSave, order, teamNames }) => {
    const [formData, setFormData] = useState({
        orderNum: '',
        orderDate: formatDateForInput(new Date()),
        customer: '',
        eventType: '',
        qty: '',
        priority: 'med',
        plants: '',
        tags: '',
        location: '',
        notes: '',
        dispatchDate: '',
        leaveHr: '',
        leaveMn: '00',
        leaveAmPm: 'AM',
        pack: '',
        team: '',
        locNote: '',
        locSorted: false,
        tagDone: false
    });
    const [manualPriOverride, setManualPriOverride] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);

    useEffect(() => {
        if (order) {
            setFormData({
                orderNum: order.orderNum || '',
                orderDate: order.orderDate || formatDateForInput(new Date()),
                customer: order.customer || '',
                eventType: order.eventType || '',
                qty: order.qty || '',
                priority: order.priority || 'med',
                plants: order.plants || '',
                tags: order.tags || '',
                location: order.location || '',
                notes: order.notes || '',
                dispatchDate: order.dispatchDate || '',
                leaveHr: order.leaveHr || '',
                leaveMn: order.leaveMn || '00',
                leaveAmPm: order.leaveAmPm || 'AM',
                pack: order.pack || '',
                team: order.team !== undefined && order.team !== -1 ? order.team.toString() : '',
                locNote: order.locNote || '',
                locSorted: order.locSorted || false,
                tagDone: order.tagDone || false
            });
        } else {
            setFormData({
                orderNum: '',
                orderDate: formatDateForInput(new Date()),
                customer: '',
                eventType: '',
                qty: '',
                priority: 'med',
                plants: '',
                tags: '',
                location: '',
                notes: '',
                dispatchDate: '',
                leaveHr: '',
                leaveMn: '00',
                leaveAmPm: 'AM',
                pack: '',
                team: '',
                locNote: '',
                locSorted: false,
                tagDone: false
            });
        }
        setManualPriOverride(false);
    }, [order]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Auto-calculate AI score for priority fields
        if (['dispatchDate', 'leaveHr', 'leaveMn', 'leaveAmPm', 'qty', 'location'].includes(name)) {
            updateAIScore();
        }
    };

    const updateAIScore = () => {
        const tempOrder = {
            dispatchDate: formData.dispatchDate,
            leaveHr: formData.leaveHr,
            leaveMn: formData.leaveMn,
            leaveAmPm: formData.leaveAmPm,
            qty: formData.qty,
            location: formData.location,
            locSorted: formData.locSorted
        };
        const score = calculateAIScore(tempOrder);
        setAiSuggestion(score);
        
        if (!manualPriOverride && score) {
            setFormData(prev => ({ ...prev, priority: score.pri }));
        }
    };

    const handleManualPriority = () => {
        setManualPriOverride(true);
    };

    const useAISuggestion = () => {
        if (aiSuggestion) {
            setFormData(prev => ({ ...prev, priority: aiSuggestion.pri }));
            setManualPriOverride(false);
        }
    };

    const handleSubmit = () => {
        const orderData = {
            ...formData,
            qty: parseInt(formData.qty) || 0,
            team: formData.team !== '' ? parseInt(formData.team) : -1,
            aiScore: aiSuggestion?.score || 0,
            aiReasons: aiSuggestion?.reasons || '',
            manualPri: manualPriOverride
        };
        onSave(orderData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-bg open" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{order ? 'Edit Order' : 'Add Order'}</h2>
                
                <div className="sec-div">📋 Order Info</div>
                <div className="f2">
                    <div className="fr">
                        <label>Order Number</label>
                        <input name="orderNum" value={formData.orderNum} onChange={handleChange} placeholder="ORD-001" />
                    </div>
                    <div className="fr">
                        <label>Order Date</label>
                        <input name="orderDate" type="date" value={formData.orderDate} onChange={handleChange} />
                    </div>
                </div>
                
                <div className="f2">
                    <div className="fr">
                        <label>Customer Name</label>
                        <input name="customer" value={formData.customer} onChange={handleChange} placeholder="Customer name" />
                    </div>
                    <div className="fr">
                        <label>Event Type</label>
                        <input name="eventType" value={formData.eventType} onChange={handleChange} placeholder="Wedding, Corporate..." />
                    </div>
                </div>
                
                <div className="sec-div">⏰ Timing & Priority</div>
                <div className="f2">
                    <div className="fr">
                        <label>Dispatch Date</label>
                        <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} />
                    </div>
                    <div className="fr">
                        <label>Leave By</label>
                        <div className="tg">
                            <select name="leaveHr" value={formData.leaveHr} onChange={handleChange}>
                                <option value="">Hour</option>
                                {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <select name="leaveMn" value={formData.leaveMn} onChange={handleChange}>
                                <option value="00">:00</option><option value="15">:15</option>
                                <option value="30">:30</option><option value="45">:45</option>
                            </select>
                            <select name="leaveAmPm" value={formData.leaveAmPm} onChange={handleChange}>
                                <option value="AM">AM</option><option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="f2">
                    <div className="fr">
                        <label>Total Quantity</label>
                        <input name="qty" type="number" value={formData.qty} onChange={handleChange} placeholder="Number of plants" />
                    </div>
                    <div className="fr">
                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange} onFocus={handleManualPriority}>
                            <option value="high">Urgent</option>
                            <option value="med">Medium</option>
                            <option value="low">Standard</option>
                        </select>
                        {aiSuggestion && (
                            <div className="pri-hint">
                                AI Score: {aiSuggestion.score}/100 — {aiSuggestion.reasons}
                            </div>
                        )}
                        {manualPriOverride && aiSuggestion && aiSuggestion.pri !== formData.priority && (
                            <div className="pri-override-row">
                                ⚠️ Manual override — AI suggests: <strong>{getPriorityLabel(aiSuggestion.pri)}</strong>
                                <button onClick={useAISuggestion}>Use AI</button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="sec-div">🌱 Plants & Tags</div>
                <div className="fr">
                    <label>Plants (e.g., Hibiscus x15, Ixora x10)</label>
                    <textarea name="plants" value={formData.plants} onChange={handleChange} rows="2"></textarea>
                </div>
                <div className="fr">
                    <label>Tag Instructions</label>
                    <textarea name="tags" value={formData.tags} onChange={handleChange} rows="2" placeholder="Customisation instructions..."></textarea>
                </div>
                
                <div className="sec-div">📍 Location</div>
                <div className="fr">
                    <label>Delivery Location</label>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
                </div>
                <div className="fr">
                    <label>Location Notes</label>
                    <textarea name="locNote" value={formData.locNote} onChange={handleChange} rows="2" placeholder="Access instructions..."></textarea>
                </div>
                <label className="cbrow green">
                    <input name="locSorted" type="checkbox" checked={formData.locSorted} onChange={handleChange} />
                    <span>✓ Location confirmed & sorted</span>
                </label>
                
                <div className="sec-div">👥 Assignment</div>
                <div className="f2">
                    <div className="fr">
                        <label>Pack Assignment</label>
                        <input name="pack" value={formData.pack} onChange={handleChange} placeholder="Pack A / Table 3" />
                    </div>
                    <div className="fr">
                        <label>Assign To</label>
                        <select name="team" value={formData.team} onChange={handleChange}>
                            <option value="">Auto-split / Unassigned</option>
                            {teamNames.map((name, idx) => (
                                <option key={idx} value={idx}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="sec-div">📝 Notes</div>
                <div className="fr">
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" placeholder="Special instructions..."></textarea>
                </div>
                
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSubmit}>Save Order</button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;