import React from 'react';
import { useOrders } from '../context/OrderContext';
import { calculateDistance, formatDate } from '../services/utils';

const TeamView = ({ orders, onEditOrder }) => {
    const { teamNames, updateTeamNames } = useOrders();
    const TEAM_SIZE = 5;

    const handleRenameTeam = async (index, newName) => {
        const newNames = [...teamNames];
        newNames[index] = newName;
        await updateTeamNames(newNames);
    };

    const getTeamOrders = (teamIndex) => {
        return orders.filter(o => parseInt(o.team) === teamIndex);
    };

    const getAutoSplitOrders = (teamIndex) => {
        const autoOrders = orders.filter(o => o.team === undefined || o.team === -1);
        let totalQty = 0;
        autoOrders.forEach(o => {
            const perPerson = splitPlantsByPerson(o.plants || '', parseInt(o.qty) || 0, 4);
            if (teamIndex < 4) {
                totalQty += perPerson[teamIndex]?.qty || 0;
            }
        });
        return totalQty;
    };

    const splitPlantsByPerson = (plantsStr, totalQty, n) => {
        const plants = parsePlants(plantsStr);
        if (!plants.length) {
            const base = Math.floor(totalQty / n);
            const extra = totalQty % n;
            return Array.from({ length: n }, (_, i) => ({ plants: [], qty: base + (i < extra ? 1 : 0) }));
        }
        const personPlants = Array.from({ length: n }, () => ({ plants: [], qty: 0 }));
        plants.forEach(plant => {
            const base = Math.floor(plant.qty / n);
            const extra = plant.qty % n;
            for (let i = 0; i < n; i++) {
                const cnt = base + (i < extra ? 1 : 0);
                if (cnt > 0) {
                    personPlants[i].plants.push({ name: plant.name, qty: cnt });
                    personPlants[i].qty += cnt;
                }
            }
        });
        return personPlants;
    };

    const parsePlants = (plantsStr) => {
        if (!plantsStr) return [];
        return plantsStr.split(',').map(p => {
            p = p.trim();
            const m = p.match(/^(.+?)\s*[xX×]\s*(\d+)$/);
            if (m) return { name: m[1].trim(), qty: parseInt(m[2]) };
            const m2 = p.match(/^(\d+)\s*[xX×]\s*(.+)$/);
            if (m2) return { name: m2[2].trim(), qty: parseInt(m2[1]) };
            return { name: p, qty: 1 };
        }).filter(p => p.name);
    };

    const getTeamColor = (index) => {
        const colors = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad'];
        return colors[index];
    };

    const getInitials = (name) => {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="team-grid">
            {teamNames.map((teamName, idx) => {
                const teamOrders = getTeamOrders(idx);
                const autoSplitQty = getAutoSplitOrders(idx);
                const totalQty = teamOrders.reduce((a, o) => a + (parseInt(o.qty) || 0), 0) + autoSplitQty;
                
                return (
                    <div key={idx} className="team-col">
                        <div className="team-header">
                            <div className="team-avatar" style={{ background: getTeamColor(idx), color: 'white' }}>
                                {getInitials(teamName)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input
                                    className="team-name-input"
                                    value={teamName}
                                    onChange={(e) => handleRenameTeam(idx, e.target.value)}
                                />
                                <div className="team-qty-txt">{teamOrders.length} assigned order{teamOrders.length !== 1 ? 's' : ''}</div>
                                <span className="team-pack-count">To pack: {totalQty} plants</span>
                            </div>
                        </div>
                        
                        {teamOrders.length === 0 && autoSplitQty === 0 && (
                            <div style={{ fontSize: '12px', color: '#aaa', padding: '4px 0' }}>No orders assigned</div>
                        )}
                        
                        {teamOrders.map(order => (
                            <div key={order._id} className="team-item" onClick={() => onEditOrder(order)} style={{ cursor: 'pointer' }}>
                                <div className="team-item-top">
                                    <span style={{ fontWeight: 'bold' }}>{order.orderNum || order.customer}</span>
                                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        <span className={`badge ${order.priority === 'high' ? 'urgent' : order.priority === 'med' ? 'medium' : 'standard'}`}>
                                            {order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard'}
                                        </span>
                                    </div>
                                </div>
                                {order.customer && order.orderNum && (
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{order.customer}</div>
                                )}
                                <div style={{ fontSize: '11px', marginTop: '3px' }}>Qty: <strong>{order.qty || '—'}</strong></div>
                                {order.location && (
                                    <div style={{ fontSize: '11px', marginTop: '4px', background: '#f0f5ff', padding: '3px 7px', borderRadius: '5px' }}>
                                        📍 {order.location}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {autoSplitQty > 0 && (
                            <div style={{ fontSize: '11px', background: '#f0fff8', padding: '6px 9px', borderRadius: '6px', marginTop: '4px' }}>
                                <strong>🌱 Auto-split orders: {autoSplitQty} plants</strong>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamView;