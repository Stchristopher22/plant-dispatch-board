import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import AIPriorityBar from '../components/AIPriorityBar';
import ViewButtons from '../components/ViewButtons';
import DayTabs from '../components/DayTabs';
import OrderCard from '../components/OrderCard';
import TeamView from '../components/TeamView';
import OrderModal from '../components/OrderModal';
import Loader from '../components/Loader';
import DashboardCharts from '../components/DashboardCharts';
import ExportModal from '../components/ExportModal';

const Dashboard = () => {
    const { orders, loading, syncing, addOrder, editOrder, teamNames, refreshOrders } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentView, setCurrentView] = useState('date');
    const [activeDay, setActiveDay] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showCharts, setShowCharts] = useState(true);
    const [showExportModal, setShowExportModal] = useState(false);
    const [syncStatus, setSyncStatus] = useState({ status: 'online', icon: '✅', text: 'Connected' });

    useEffect(() => {
        if (syncing) {
            setSyncStatus({ status: 'syncing', icon: '🔄', text: 'Syncing...' });
        } else {
            setSyncStatus({ status: 'online', icon: '✅', text: `${orders.length} orders` });
        }
    }, [syncing, orders.length]);

    const getFilteredOrders = () => {
        let filtered = orders;
        
        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                (o.orderNum || '').toLowerCase().includes(query) ||
                (o.customer || '').toLowerCase().includes(query) ||
                (o.location || '').toLowerCase().includes(query) ||
                (o.eventType || '').toLowerCase().includes(query)
            );
        }
        
        // Apply date filter
        if (activeDay !== 'all') {
            filtered = filtered.filter(o => o.orderDate === activeDay);
        }
        
        // Sort by priority and date
        const priorityOrder = { high: 0, med: 1, low: 2 };
        filtered.sort((a, b) => {
            // First by priority
            const priorityDiff = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then by date
            if (a.orderDate !== b.orderDate) {
                return (a.orderDate || '').localeCompare(b.orderDate || '');
            }
            
            // Then by dispatch date
            if (a.dispatchDate !== b.dispatchDate) {
                return (a.dispatchDate || '').localeCompare(b.dispatchDate || '');
            }
            
            return 0;
        });
        
        return filtered;
    };

    const handleAddOrder = () => {
        setEditingOrder(null);
        setModalOpen(true);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setModalOpen(true);
    };

    const handleSaveOrder = async (orderData) => {
        try {
            if (editingOrder) {
                await editOrder(editingOrder._id, orderData);
            } else {
                await addOrder(orderData);
            }
            setModalOpen(false);
            setEditingOrder(null);
            // Refresh orders to get updated data
            await refreshOrders();
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Error saving order. Please try again.');
        }
    };

    const handleUpdateOrder = async (id, updates) => {
        try {
            await editOrder(id, updates);
            await refreshOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleExportClick = () => {
        setShowExportModal(true);
    };

    const scrollToCard = (id) => {
        const element = document.getElementById(`order-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.outline = '2px solid #d63031';
            element.style.transition = 'outline 0.3s ease';
            setTimeout(() => {
                if (element) element.style.outline = '';
            }, 2000);
        }
    };

    const filteredOrders = getFilteredOrders();
    
    // Calculate summary stats for display
    const urgentCount = filteredOrders.filter(o => o.priority === 'high').length;
    const totalPlants = filteredOrders.reduce((sum, o) => sum + (parseInt(o.qty) || 0), 0);
    const completionRate = filteredOrders.length > 0 
        ? ((filteredOrders.filter(o => o.status === 'Dispatched').length / filteredOrders.length) * 100).toFixed(1)
        : 0;

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddOrder={handleAddOrder}
                onExport={handleExportClick}
                orders={orders}
                syncStatus={syncStatus}
            />
            
            <StatsBar orders={orders} />
            
            <AIPriorityBar orders={orders} onScrollToCard={scrollToCard} />
            
            <ViewButtons currentView={currentView} onViewChange={setCurrentView} />
            
            {/* Charts Toggle Button */}
            {currentView === 'date' && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <button 
                        className="view-btn" 
                        onClick={() => setShowCharts(!showCharts)}
                        style={{ 
                            background: showCharts ? '#1a7a55' : 'white', 
                            color: showCharts ? 'white' : '#333',
                            border: '1px solid #1a7a55'
                        }}
                    >
                        {showCharts ? '📊 Hide Analytics' : '📈 Show Analytics'}
                    </button>
                    
                    {/* Quick Stats Summary */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        fontSize: '12px',
                        background: '#f8f9fa',
                        padding: '8px 15px',
                        borderRadius: '20px'
                    }}>
                        <span>📋 <strong>{filteredOrders.length}</strong> orders</span>
                        <span>🚨 <strong style={{ color: '#e74c3c' }}>{urgentCount}</strong> urgent</span>
                        <span>🌱 <strong>{totalPlants}</strong> plants</span>
                        <span>✅ <strong>{completionRate}%</strong> completed</span>
                    </div>
                </div>
            )}
            
            {/* Analytics Charts */}
            {currentView === 'date' && showCharts && filteredOrders.length > 0 && (
                <DashboardCharts orders={filteredOrders} />
            )}
            
            {/* Main Content Area */}
            {currentView === 'date' && (
                <>
                    <DayTabs
                        orders={orders}
                        activeDay={activeDay}
                        onDayChange={setActiveDay}
                    />
                    <main>
                        {filteredOrders.length === 0 ? (
                            <div className="empty">
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>📭 No orders found</p>
                                    <p style={{ color: '#888' }}>
                                        {searchQuery ? 'Try a different search term' : 'Click "+ Add Order" to create your first order'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            filteredOrders.map(order => (
                                <div key={order._id} id={`order-${order._id}`}>
                                    <OrderCard 
                                        order={order} 
                                        onEdit={handleEditOrder} 
                                        teamNames={teamNames}
                                        onUpdate={handleUpdateOrder}
                                    />
                                </div>
                            ))
                        )}
                    </main>
                </>
            )}
            
            {currentView === 'team' && (
                <main>
                    <TeamView 
                        orders={filteredOrders} 
                        onEditOrder={handleEditOrder} 
                        teamNames={teamNames}
                    />
                </main>
            )}
            
            {/* Modals */}
            <OrderModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingOrder(null);
                }}
                onSave={handleSaveOrder}
                order={editingOrder}
                teamNames={teamNames}
            />
            
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                orders={filteredOrders}
                allOrders={orders}
            />
        </>
    );
};

export default Dashboard;