import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { calculateDistance, calculateCost, formatDate, getPriorityClass, getPriorityLabel } from '../services/utils';
import Lightbox from './Lightbox';

const TAG_STEPS = ['Tag design confirmed', 'Sent to print', 'Printed & checked', 'Attached to order'];

const OrderCard = ({ order, onEdit }) => {
    const { editOrder, removeOrder, teamNames } = useOrders();
    const [lightboxImage, setLightboxImage] = useState(null);

    const { km } = calculateDistance(order.location || '');
    const priorityClass = getPriorityClass(order.priority);
    const priorityLabel = getPriorityLabel(order.priority);
    const plants = order.plants ? order.plants.split(',').map(p => p.trim()).filter(Boolean) : [];
    const packedPlants = order.packedPlants || {};

    const handleTogglePlant = async (plant) => {
        const updated = { ...packedPlants, [plant]: !packedPlants[plant] };
        await editOrder(order._id, { packedPlants: updated });
    };

    const handleToggleCheck = async (index) => {
        const newChecks = [...(order.tagChecks || [false, false, false, false])];
        newChecks[index] = !newChecks[index];
        await editOrder(order._id, { tagChecks: newChecks });
    };

    const handleToggleTagDone = async () => {
        await editOrder(order._id, { tagDone: !order.tagDone });
    };

    const handleToggleLocSorted = async () => {
        await editOrder(order._id, { locSorted: !order.locSorted });
    };

    const handleStatusChange = async (e) => {
        await editOrder(order._id, { status: e.target.value });
    };

    const formatLeaveTime = () => {
        if (!order.leaveHr) return null;
        return `${order.leaveHr}:${order.leaveMn || '00'} ${order.leaveAmPm || 'AM'}`;
    };

    return (
        <>
            <div className={`order-card p-${order.priority}`}>
                <div className="card-top">
                    <span className="card-num">{order.orderNum || '—'}</span>
                    <span className="card-customer">{order.customer || '—'}</span>
                    <div className="badges">
                        <span className={`badge ${priorityClass}`}>{priorityLabel}</span>
                        {order.manualPri && <span className="manual-pri-badge">Manual</span>}
                        <span className="badge ai-scored">AI: {order.aiScore || 0}/100</span>
                        {order.eventType && <span className="badge event">{order.eventType}</span>}
                        <span className="badge bstatus">{order.status || 'Pending'}</span>
                        {order.tags && <span className="badge btag">Custom tag{order.tagDone ? ' ✓' : ''}</span>}
                        {order.team >= 0 && <span className="badge bteam">{teamNames[order.team]}</span>}
                    </div>
                </div>

                <div className="card-meta">
                    <span>Qty: <strong>{order.qty || '—'}</strong></span>
                    {order.dispatchDate && <span>Dispatch: <strong>{formatDate(order.dispatchDate)}</strong></span>}
                    {order.pack && <span>Pack: <strong>{order.pack}</strong></span>}
                    {formatLeaveTime() && <span className="leave-pill">Leave by: {formatLeaveTime()}</span>}
                    {km > 0 && <span className="dist-pill">~{km} km away</span>}
                </div>

                <div className="ai-reason-box">
                    🤖 AI reason: {order.aiReasons || 'No data yet'}
                </div>

                {plants.length > 0 && (
                    <div className="plants-row">
                        {plants.map(plant => (
                            <span 
                                key={plant}
                                className={`plant-pill ${packedPlants[plant] ? 'packed' : ''}`}
                                onClick={() => handleTogglePlant(plant)}
                            >
                                {plant}
                            </span>
                        ))}
                    </div>
                )}

                {order.tags && (
                    <div className="tag-section">
                        <div className="tag-top-row">
                            <div className="tag-instructions"><strong>Tag:</strong> {order.tags}</div>
                            <label className={`tag-done-btn ${order.tagDone ? 'is-done' : ''}`}>
                                <input type="checkbox" checked={order.tagDone} onChange={handleToggleTagDone} />
                                {order.tagDone ? 'Done ✓' : 'Mark done'}
                            </label>
                        </div>
                        {order.tagImages && order.tagImages.length > 0 && (
                            <div className="tag-img-preview">
                                {order.tagImages.map((src, idx) => (
                                    <img key={idx} src={src} onClick={() => setLightboxImage(src)} alt="tag" />
                                ))}
                            </div>
                        )}
                        <div className="tag-checklist">
                            <div className="tag-check-lbl">Tag print checklist</div>
                            {TAG_STEPS.map((label, idx) => (
                                <label key={idx} className={`check-row ${order.tagChecks?.[idx] ? 'done' : ''}`}>
                                    <input type="checkbox" checked={order.tagChecks?.[idx] || false} onChange={() => handleToggleCheck(idx)} />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {order.location && (
                    <div className="location-section">
                        <div className="location-top">
                            <span className="loc-lbl">📍 Delivery</span>
                            <span className="loc-val">{order.location}</span>
                            <label className={`loc-sorted-btn ${order.locSorted ? 'is-sorted' : ''}`}>
                                <input type="checkbox" checked={order.locSorted} onChange={handleToggleLocSorted} />
                                {order.locSorted ? 'Confirmed ✓' : 'Confirm?'}
                            </label>
                        </div>
                        {km > 0 && (
                            <div className="loc-dist-row">
                                <span>📦 Distance: ~{km} km</span>
                                <span>💰 Cost: ~₹{calculateCost(km)}</span>
                            </div>
                        )}
                        {order.locNote && <div className="loc-note-txt">{order.locNote}</div>}
                    </div>
                )}

                {order.notes && <div className="notes-txt">{order.notes}</div>}

                <div className="card-actions">
                    <select className="s-select" value={order.status || 'Pending'} onChange={handleStatusChange}>
                        <option>Pending</option>
                        <option>Tags in Progress</option>
                        <option>Plants Prepared</option>
                        <option>Packing</option>
                        <option>Ready to Dispatch</option>
                        <option>Dispatched</option>
                    </select>
                    <button className="btn-sm" onClick={() => onEdit(order)}>Edit</button>
                    <button className="btn-sm del" onClick={() => removeOrder(order._id)}>Remove</button>
                </div>
            </div>

            <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        </>
    );
};

export default OrderCard;