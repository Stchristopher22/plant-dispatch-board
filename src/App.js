import React from 'react';
import { OrderProvider } from './context/OrderContext';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
    return (
        <OrderProvider>
            <Dashboard />
        </OrderProvider>
    );
}

export default App;