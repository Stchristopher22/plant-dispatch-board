import React from 'react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardCharts = ({ orders }) => {
    // Calculate stats for charts
    const calculatePriorityData = () => {
        const urgent = orders.filter(o => o.priority === 'high').length;
        const medium = orders.filter(o => o.priority === 'med').length;
        const standard = orders.filter(o => o.priority === 'low').length;
        
        return {
            labels: ['Urgent', 'Medium', 'Standard'],
            datasets: [{
                data: [urgent, medium, standard],
                backgroundColor: ['#e74c3c', '#f39c12', '#27ae60'],
                borderWidth: 0
            }]
        };
    };
    
    const calculateStatusData = () => {
        const pending = orders.filter(o => o.status === 'Pending').length;
        const tagsProgress = orders.filter(o => o.status === 'Tags in Progress').length;
        const plantsPrepared = orders.filter(o => o.status === 'Plants Prepared').length;
        const packing = orders.filter(o => o.status === 'Packing').length;
        const ready = orders.filter(o => o.status === 'Ready to Dispatch').length;
        const dispatched = orders.filter(o => o.status === 'Dispatched').length;
        
        return {
            labels: ['Pending', 'Tags', 'Plants Ready', 'Packing', 'Ready', 'Dispatched'],
            datasets: [{
                label: 'Orders by Status',
                data: [pending, tagsProgress, plantsPrepared, packing, ready, dispatched],
                backgroundColor: '#3498db',
                borderRadius: 5
            }]
        };
    };
    
    const regionData = () => {
        const regions = {
            'South India': 0,
            'North India': 0,
            'West India': 0,
            'East India': 0,
            'Central India': 0,
            'Chennai Local': 0
        };
        
        orders.forEach(order => {
            const location = (order.location || '').toLowerCase();
            if (location.includes('chennai') || location.includes('t nagar')) {
                regions['Chennai Local'] += 1;
            } else if (location.includes('bangalore') || location.includes('hyderabad')) {
                regions['South India'] += 1;
            } else if (location.includes('mumbai') || location.includes('pune')) {
                regions['West India'] += 1;
            } else if (location.includes('delhi') || location.includes('jaipur')) {
                regions['North India'] += 1;
            } else if (location.includes('kolkata')) {
                regions['East India'] += 1;
            } else if (location.includes('bhopal') || location.includes('indore')) {
                regions['Central India'] += 1;
            }
        });
        
        return {
            labels: Object.keys(regions),
            datasets: [{
                data: Object.values(regions),
                backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#2ecc71'],
                borderWidth: 0
            }]
        };
    };
    
    const priorityOptions = {
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Order Priority Distribution' }
        }
    };
    
    const statusOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Order Status Breakdown' }
        }
    };
    
    const regionOptions = {
        plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Orders by Region' }
        }
    };
    
    if (orders.length === 0) {
        return (
            <div className="empty" style={{ padding: '40px', textAlign: 'center' }}>
                No data available for charts. Add some orders to see analytics.
            </div>
        );
    }
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Pie data={calculatePriorityData()} options={priorityOptions} />
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Bar data={calculateStatusData()} options={statusOptions} />
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Pie data={regionData()} options={regionOptions} />
            </div>
        </div>
    );
};

export default DashboardCharts;