// Export Service using CDN globals

// Format date for reports
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN');
};

// Calculate statistics
const calculateStats = (orders) => {
    const totalOrders = orders.length;
    const totalPlants = orders.reduce((sum, o) => sum + (parseInt(o.qty) || 0), 0);
    const urgentOrders = orders.filter(o => o.priority === 'high').length;
    const dispatchedOrders = orders.filter(o => o.status === 'Dispatched').length;
    const completionRate = totalOrders > 0 ? ((dispatchedOrders / totalOrders) * 100).toFixed(1) : 0;
    
    return { totalOrders, totalPlants, urgentOrders, dispatchedOrders, completionRate };
};

// Export to Excel
export const exportToExcel = (orders) => {
    try {
        const XLSX = window.XLSX;
        if (!XLSX) {
            alert('Excel library not loaded. Please refresh the page.');
            return;
        }
        
        const ordersData = orders.map(order => ({
            'Order Number': order.orderNum || 'N/A',
            'Order Date': formatDate(order.orderDate),
            'Customer': order.customer || 'N/A',
            'Event Type': order.eventType || 'N/A',
            'Quantity': order.qty || 0,
            'Priority': order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            'Status': order.status || 'Pending',
            'Location': order.location || 'N/A',
            'Tag Required': order.tags ? 'Yes' : 'No',
            'Location Confirmed': order.locSorted ? 'Yes' : 'No'
        }));
        
        const ws = XLSX.utils.json_to_sheet(ordersData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        
        const fileName = `Plant_Dispatch_Report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        alert('✅ Excel file exported successfully!');
    } catch (error) {
        console.error('Excel export error:', error);
        alert('Error generating Excel file: ' + error.message);
    }
};

// Export to PDF
export const exportToPDF = (orders) => {
    try {
        const { jsPDF } = window.jspdf || window;
        if (!jsPDF) {
            alert('PDF library not loaded. Please refresh the page.');
            return;
        }
        
        const stats = calculateStats(orders);
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // Title
        doc.setFontSize(18);
        doc.setTextColor(26, 122, 85);
        doc.text('Plant Centre Dispatch Report', 20, 20);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
        
        // Summary
        doc.setFillColor(26, 122, 85);
        doc.setTextColor(255, 255, 255);
        doc.rect(20, 40, 50, 20, 'F');
        doc.setFontSize(10);
        doc.text(`Total: ${stats.totalOrders}`, 25, 50);
        
        doc.setFillColor(231, 76, 60);
        doc.rect(80, 40, 50, 20, 'F');
        doc.text(`Urgent: ${stats.urgentOrders}`, 85, 50);
        
        doc.setFillColor(46, 125, 50);
        doc.rect(140, 40, 50, 20, 'F');
        doc.text(`Plants: ${stats.totalPlants}`, 145, 50);
        
        // Orders table
        const tableData = orders.slice(0, 15).map(order => [
            (order.orderNum || 'N/A').substring(0, 10),
            (order.customer || 'N/A').substring(0, 15),
            (order.qty || 0).toString(),
            order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            (order.status || 'Pending').substring(0, 12)
        ]);
        
        if (doc.autoTable) {
            doc.autoTable({
                startY: 70,
                head: [['Order #', 'Customer', 'Qty', 'Priority', 'Status']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [26, 122, 85], textColor: 255 },
                margin: { left: 20, right: 20 }
            });
        } else {
            // Manual table if autoTable not available
            let y = 75;
            doc.setFontSize(10);
            doc.text('Order Details:', 20, y);
            y += 10;
            orders.slice(0, 15).forEach((order, idx) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${idx + 1}. ${order.orderNum} - ${order.customer} (${order.qty} plants)`, 20, y);
                y += 7;
            });
        }
        
        doc.save(`Plant_Dispatch_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        alert('✅ PDF exported successfully!');
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Error generating PDF: ' + error.message + '\n\nTry using Excel or CSV format instead.');
    }
};

// Export to CSV
export const exportToCSV = (orders) => {
    try {
        const headers = ['Order Number', 'Order Date', 'Customer', 'Quantity', 'Priority', 'Status', 'Location'];
        
        const rows = orders.map(order => [
            `"${(order.orderNum || '').replace(/"/g, '""')}"`,
            `"${(order.orderDate || '')}"`,
            `"${(order.customer || '').replace(/"/g, '""')}"`,
            order.qty || 0,
            order.priority === 'high' ? 'Urgent' : order.priority === 'med' ? 'Medium' : 'Standard',
            `"${(order.status || 'Pending')}"`,
            `"${(order.location || '').replace(/"/g, '""')}"`
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `Plant_Dispatch_Export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('✅ CSV exported successfully!');
    } catch (error) {
        console.error('CSV export error:', error);
        alert('Error generating CSV file.');
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
                plants: order.plants,
                location: order.location,
                status: order.status,
                tags: order.tags,
                tagDone: order.tagDone,
                locSorted: order.locSorted,
                notes: order.notes
            }))
        };
        
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `Plant_Dispatch_Backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('✅ JSON exported successfully!');
    } catch (error) {
        console.error('JSON export error:', error);
        alert('Error generating JSON file.');
    }
};