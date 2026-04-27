import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Format date for reports
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN');
};

// Calculate statistics for reports
const calculateStats = (orders) => {
    const totalOrders = orders.length;
    const totalPlants = orders.reduce((sum, o) => sum + (parseInt(o.qty) || 0), 0);
    const urgentOrders = orders.filter(o => o.priority === 'high').length;
    const mediumOrders = orders.filter(o => o.priority === 'med').length;
    const lowOrders = orders.filter(o => o.priority === 'low').length;
    const dispatchedOrders = orders.filter(o => o.status === 'Dispatched').length;
    const pendingOrders = orders.filter(o => o.status !== 'Dispatched').length;
    const tagPending = orders.filter(o => o.tags && !o.tagDone).length;
    const locationUnconfirmed = orders.filter(o => o.location && !o.locSorted).length;
    
    // Region wise distribution
    const regionStats = {
        'South India': 0,
        'North India': 0,
        'West India': 0,
        'East India': 0,
        'Central India': 0,
        'Chennai Local': 0
    };
    
    orders.forEach(order => {
        const location = (order.location || '').toLowerCase();
        if (location.includes('chennai') || location.includes('t nagar') || location.includes('anna nagar')) {
            regionStats['Chennai Local'] += parseInt(order.qty) || 0;
        } else if (location.includes('bangalore') || location.includes('hyderabad') || location.includes('coimbatore')) {
            regionStats['South India'] += parseInt(order.qty) || 0;
        } else if (location.includes('mumbai') || location.includes('pune') || location.includes('ahmedabad')) {
            regionStats['West India'] += parseInt(order.qty) || 0;
        } else if (location.includes('delhi') || location.includes('jaipur') || location.includes('lucknow')) {
            regionStats['North India'] += parseInt(order.qty) || 0;
        } else if (location.includes('kolkata') || location.includes('bhubaneswar')) {
            regionStats['East India'] += parseInt(order.qty) || 0;
        } else if (location.includes('bhopal') || location.includes('indore')) {
            regionStats['Central India'] += parseInt(order.qty) || 0;
        }
    });
    
    return {
        totalOrders,
        totalPlants,
        urgentOrders,
        mediumOrders,
        lowOrders,
        dispatchedOrders,
        pendingOrders,
        tagPending,
        locationUnconfirmed,
        completionRate: totalOrders > 0 ? ((dispatchedOrders / totalOrders) * 100).toFixed(1) : 0,
        regionStats
    };
};

// Export to Excel with multiple sheets
export const exportToExcel = (orders) => {
    try {
        const stats = calculateStats(orders);
        
        // Sheet 1: Orders List
        const ordersData = orders.map(order => ({
            'Order Number': order.orderNum || 'N/A',
            'Order Date': formatDate(order.orderDate),
            'Customer': order.customer || 'N/A',
            'Event Type': order.eventType || 'N/A',
            'Quantity': order.qty || 0,
            'Priority': order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            'AI Score': order.aiScore || 0,
            'Status': order.status || 'Pending',
            'Location': order.location || 'N/A',
            'Tag Required': order.tags ? 'Yes' : 'No',
            'Tag Done': order.tagDone ? 'Yes' : 'No',
            'Location Confirmed': order.locSorted ? 'Yes' : 'No',
            'Notes': (order.notes || 'N/A').substring(0, 100)
        }));
        
        const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
        ordersSheet['!cols'] = [
            { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 15 },
            { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 },
            { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }
        ];
        
        // Sheet 2: Summary Statistics
        const summaryData = [
            { 'Metric': 'Total Orders', 'Value': stats.totalOrders },
            { 'Metric': 'Total Plants', 'Value': stats.totalPlants },
            { 'Metric': 'Urgent Orders', 'Value': stats.urgentOrders },
            { 'Metric': 'Medium Priority Orders', 'Value': stats.mediumOrders },
            { 'Metric': 'Standard Priority Orders', 'Value': stats.lowOrders },
            { 'Metric': 'Dispatched Orders', 'Value': stats.dispatchedOrders },
            { 'Metric': 'Pending Orders', 'Value': stats.pendingOrders },
            { 'Metric': 'Completion Rate', 'Value': `${stats.completionRate}%` },
            { 'Metric': 'Tag Work Pending', 'Value': stats.tagPending },
            { 'Metric': 'Location Unconfirmed', 'Value': stats.locationUnconfirmed }
        ];
        
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        
        // Sheet 3: Region-wise Distribution
        const regionData = Object.entries(stats.regionStats).map(([region, plants]) => ({
            'Region': region,
            'Total Plants': plants,
            'Percentage': stats.totalPlants > 0 ? ((plants / stats.totalPlants) * 100).toFixed(1) + '%' : '0%'
        }));
        
        const regionSheet = XLSX.utils.json_to_sheet(regionData);
        
        // Create workbook with multiple sheets
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders');
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        XLSX.utils.book_append_sheet(workbook, regionSheet, 'Region Distribution');
        
        // Generate Excel file
        const fileName = `Plant_Dispatch_Report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        return true;
    } catch (error) {
        console.error('Excel export error:', error);
        alert('Error generating Excel file. Please try again.');
        return false;
    }
};

// Export to PDF with proper autoTable initialization
export const exportToPDF = (orders) => {
    try {
        // Check if jsPDF is properly loaded
        if (typeof jsPDF === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }
        
        const stats = calculateStats(orders);
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(26, 122, 85);
        doc.text('🌿 Plant Centre Dispatch Report', 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
        doc.text(`From: Plant Centre, Moola Chatram, Selaivayal, Chennai 600051`, 20, 37);
        
        // Summary Cards
        doc.setFillColor(26, 122, 85);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 45, 50, 25, 'F');
        doc.setFontSize(9);
        doc.text('Total Orders', 30, 55);
        doc.setFontSize(16);
        doc.text(stats.totalOrders.toString(), 35, 67);
        
        doc.setFillColor(231, 76, 60);
        doc.rect(80, 45, 50, 25, 'F');
        doc.text('Urgent', 92, 55);
        doc.text(stats.urgentOrders.toString(), 97, 67);
        
        doc.setFillColor(46, 125, 50);
        doc.rect(140, 45, 50, 25, 'F');
        doc.text('Total Plants', 150, 55);
        doc.text(stats.totalPlants.toString(), 155, 67);
        
        doc.setFillColor(41, 128, 185);
        doc.rect(200, 45, 60, 25, 'F');
        doc.text('Completion Rate', 212, 55);
        doc.text(`${stats.completionRate}%`, 225, 67);
        
        // Orders Table - Using autoTable properly
        const tableData = orders.slice(0, 20).map(order => [
            (order.orderNum || 'N/A').substring(0, 12),
            (order.customer || 'N/A').substring(0, 20),
            (order.qty || 0).toString(),
            order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            (order.status || 'Pending').substring(0, 15),
            (order.location || 'N/A').substring(0, 20)
        ]);
        
        // Use autoTable if available
        if (doc.autoTable) {
            doc.autoTable({
                startY: 80,
                head: [['Order #', 'Customer', 'Qty', 'Priority', 'Status', 'Location']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [26, 122, 85], textColor: 255, fontSize: 10 },
                bodyStyles: { fontSize: 9 },
                alternateRowStyles: { fillColor: [240, 248, 240] },
                margin: { left: 20, right: 20 }
            });
            
            let finalY = doc.lastAutoTable.finalY + 15;
            
            // Region Distribution
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('📍 Region-wise Distribution', 20, finalY);
            
            finalY += 10;
            doc.setFontSize(9);
            let yOffset = finalY;
            Object.entries(stats.regionStats).forEach(([region, plants]) => {
                if (plants > 0) {
                    doc.text(`${region}: ${plants} plants`, 25, yOffset);
                    yOffset += 6;
                }
            });
        } else {
            // Fallback if autoTable is not available
            doc.text('Order Details:', 20, 80);
            let y = 90;
            orders.slice(0, 10).forEach((order, idx) => {
                doc.text(`${idx + 1}. ${order.orderNum} - ${order.customer} - Qty: ${order.qty}`, 20, y);
                y += 7;
            });
        }
        
        // Save PDF
        doc.save(`Plant_Dispatch_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Error generating PDF. Please ensure jspdf and jspdf-autotable are properly installed.\n\n' + error.message);
        return false;
    }
};

// Export to CSV
export const exportToCSV = (orders) => {
    try {
        const headers = ['Order Number', 'Order Date', 'Customer', 'Event Type', 'Quantity', 'Priority', 'AI Score', 'Status', 'Location', 'Tags', 'Tag Done', 'Location Confirmed', 'Notes'];
        
        const rows = orders.map(order => [
            `"${(order.orderNum || '').replace(/"/g, '""')}"`,
            `"${(order.orderDate || '')}"`,
            `"${(order.customer || '').replace(/"/g, '""')}"`,
            `"${(order.eventType || '').replace(/"/g, '""')}"`,
            order.qty || 0,
            order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            order.aiScore || 0,
            `"${(order.status || 'Pending')}"`,
            `"${(order.location || '').replace(/"/g, '""')}"`,
            order.tags ? 'Yes' : 'No',
            order.tagDone ? 'Yes' : 'No',
            order.locSorted ? 'Yes' : 'No',
            `"${((order.notes || '').replace(/"/g, '""')).substring(0, 200)}"`
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `Plant_Dispatch_Export_${new Date().toISOString().slice(0, 10)}.csv`);
        return true;
    } catch (error) {
        console.error('CSV export error:', error);
        alert('Error generating CSV file.');
        return false;
    }
};

// Export to JSON
export const exportToJSON = (orders) => {
    try {
        const exportData = {
            generatedAt: new Date().toISOString(),
            totalOrders: orders.length,
            orders: orders.map(order => ({
                orderNum: order.orderNum,
                orderDate: order.orderDate,
                customer: order.customer,
                eventType: order.eventType,
                qty: order.qty,
                priority: order.priority,
                aiScore: order.aiScore,
                aiReasons: order.aiReasons,
                plants: order.plants,
                location: order.location,
                status: order.status,
                tags: order.tags,
                tagDone: order.tagDone,
                locSorted: order.locSorted,
                locNote: order.locNote,
                notes: order.notes,
                team: order.team,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }))
        };
        
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        saveAs(blob, `Plant_Dispatch_Backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
        return true;
    } catch (error) {
        console.error('JSON export error:', error);
        alert('Error generating JSON file.');
        return false;
    }
};