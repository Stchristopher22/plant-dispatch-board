import React, { createContext, useState, useEffect, useContext } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder, getTeams, updateTeams } from '../services/api';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [teamNames, setTeamNames] = useState(['Person A', 'Person B', 'Person C', 'Person D', 'Person E']);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const loadOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error loading orders:', error);
            // Load from localStorage as fallback
            const saved = localStorage.getItem('pcdb_orders');
            if (saved) setOrders(JSON.parse(saved));
        } finally {
            setLoading(false);
        }
    };

    const loadTeams = async () => {
        try {
            const response = await getTeams();
            setTeamNames(response.data.names);
            localStorage.setItem('pcdb_teams', JSON.stringify(response.data.names));
        } catch (error) {
            console.error('Error loading teams:', error);
            const saved = localStorage.getItem('pcdb_teams');
            if (saved) setTeamNames(JSON.parse(saved));
        }
    };

    const addOrder = async (orderData) => {
        setSyncing(true);
        try {
            const response = await createOrder(orderData);
            setOrders(prev => [response.data, ...prev]);
            localStorage.setItem('pcdb_orders', JSON.stringify([response.data, ...orders]));
            return response.data;
        } catch (error) {
            console.error('Error adding order:', error);
            const tempOrder = { ...orderData, id: 'temp_' + Date.now() };
            setOrders(prev => [tempOrder, ...prev]);
            localStorage.setItem('pcdb_orders', JSON.stringify([tempOrder, ...orders]));
            return tempOrder;
        } finally {
            setSyncing(false);
        }
    };

    const editOrder = async (id, orderData) => {
        setSyncing(true);
        try {
            const response = await updateOrder(id, orderData);
            setOrders(prev => prev.map(o => o._id === id ? response.data : o));
            localStorage.setItem('pcdb_orders', JSON.stringify(orders.map(o => o._id === id ? response.data : o)));
        } catch (error) {
            console.error('Error updating order:', error);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, ...orderData } : o));
            localStorage.setItem('pcdb_orders', JSON.stringify(orders.map(o => o._id === id ? { ...o, ...orderData } : o)));
        } finally {
            setSyncing(false);
        }
    };

    const removeOrder = async (id) => {
        if (!window.confirm('Delete this order permanently?')) return;
        setSyncing(true);
        try {
            await deleteOrder(id);
            setOrders(prev => prev.filter(o => o._id !== id));
            localStorage.setItem('pcdb_orders', JSON.stringify(orders.filter(o => o._id !== id)));
        } catch (error) {
            console.error('Error deleting order:', error);
            setOrders(prev => prev.filter(o => o._id !== id));
            localStorage.setItem('pcdb_orders', JSON.stringify(orders.filter(o => o._id !== id)));
        } finally {
            setSyncing(false);
        }
    };

    const updateTeamNames = async (names) => {
        try {
            await updateTeams(names);
            setTeamNames(names);
            localStorage.setItem('pcdb_teams', JSON.stringify(names));
        } catch (error) {
            console.error('Error updating teams:', error);
            setTeamNames(names);
            localStorage.setItem('pcdb_teams', JSON.stringify(names));
        }
    };

    useEffect(() => {
        loadOrders();
        loadTeams();
    }, []);

    return (
        <OrderContext.Provider value={{
            orders,
            teamNames,
            loading,
            syncing,
            addOrder,
            editOrder,
            removeOrder,
            updateTeamNames,
            refreshOrders: loadOrders
        }}>
            {children}
        </OrderContext.Provider>
    );
};