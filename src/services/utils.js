// Location database with distances from Chennai (in km)
const LOCATION_DB = {
    // South India
    'chennai': { lat: 13.0827, lng: 80.2707, region: 'south', distance: 0 },
    'bangalore': { lat: 12.9716, lng: 77.5946, region: 'south', distance: 350 },
    'hyderabad': { lat: 17.3850, lng: 78.4867, region: 'south', distance: 630 },
    'coimbatore': { lat: 11.0168, lng: 76.9558, region: 'south', distance: 520 },
    'madurai': { lat: 9.9252, lng: 78.1198, region: 'south', distance: 450 },
    'mysore': { lat: 12.2958, lng: 76.6394, region: 'south', distance: 440 },
    'mangalore': { lat: 12.9141, lng: 74.8560, region: 'south', distance: 680 },
    'kochi': { lat: 9.9312, lng: 76.2673, region: 'south', distance: 680 },
    'trivandrum': { lat: 8.5241, lng: 76.9366, region: 'south', distance: 780 },
    'vizag': { lat: 17.6868, lng: 83.2185, region: 'south', distance: 810 },
    'vijayawada': { lat: 16.5062, lng: 80.6480, region: 'south', distance: 570 },
    'tirupati': { lat: 13.6288, lng: 79.4192, region: 'south', distance: 160 },
    'pondicherry': { lat: 11.9416, lng: 79.8083, region: 'south', distance: 160 },
    
    // West India
    'mumbai': { lat: 19.0760, lng: 72.8777, region: 'west', distance: 1330 },
    'pune': { lat: 18.5204, lng: 73.8567, region: 'west', distance: 1050 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, region: 'west', distance: 1580 },
    'surat': { lat: 21.1702, lng: 72.8311, region: 'west', distance: 1400 },
    'vadodara': { lat: 22.3072, lng: 73.1812, region: 'west', distance: 1480 },
    'nashik': { lat: 19.9975, lng: 73.7898, region: 'west', distance: 1200 },
    'goa': { lat: 15.2993, lng: 74.1240, region: 'west', distance: 900 },
    'rajkot': { lat: 22.3039, lng: 70.8022, region: 'west', distance: 1750 },
    'bhavnagar': { lat: 21.7645, lng: 72.1519, region: 'west', distance: 1650 },
    
    // North India
    'delhi': { lat: 28.6139, lng: 77.2090, region: 'north', distance: 2200 },
    'jaipur': { lat: 26.9124, lng: 75.7873, region: 'north', distance: 1950 },
    'lucknow': { lat: 26.8467, lng: 80.9462, region: 'north', distance: 1750 },
    'kanpur': { lat: 26.4499, lng: 80.3319, region: 'north', distance: 1700 },
    'agra': { lat: 27.1767, lng: 78.0081, region: 'north', distance: 1900 },
    'chandigarh': { lat: 30.7333, lng: 76.7794, region: 'north', distance: 2400 },
    'amritsar': { lat: 31.6340, lng: 74.8723, region: 'north', distance: 2650 },
    'noida': { lat: 28.5355, lng: 77.3910, region: 'north', distance: 2180 },
    'gurgaon': { lat: 28.4595, lng: 77.0266, region: 'north', distance: 2220 },
    'dehradun': { lat: 30.3165, lng: 78.0322, region: 'north', distance: 2350 },
    'shimla': { lat: 31.1048, lng: 77.1734, region: 'north', distance: 2550 },
    
    // East India
    'kolkata': { lat: 22.5726, lng: 88.3639, region: 'east', distance: 1660 },
    'bhubaneswar': { lat: 20.2961, lng: 85.8245, region: 'east', distance: 1200 },
    'patna': { lat: 25.5941, lng: 85.1376, region: 'east', distance: 1750 },
    'ranchi': { lat: 23.3441, lng: 85.3096, region: 'east', distance: 1450 },
    'jamshedpur': { lat: 22.8046, lng: 86.2029, region: 'east', distance: 1400 },
    'guwahati': { lat: 26.1445, lng: 91.7362, region: 'northeast', distance: 2400 },
    'siliguri': { lat: 26.7271, lng: 88.3885, region: 'east', distance: 2000 },
    
    // Central India
    'bhopal': { lat: 23.2599, lng: 77.4126, region: 'central', distance: 1350 },
    'indore': { lat: 22.7196, lng: 75.8577, region: 'central', distance: 1250 },
    'nagpur': { lat: 21.1458, lng: 79.0882, region: 'central', distance: 1100 },
    'raipur': { lat: 21.2514, lng: 81.6296, region: 'central', distance: 1050 },
    'jabalpur': { lat: 23.1815, lng: 79.9864, region: 'central', distance: 1250 },
    'gwalior': { lat: 26.2183, lng: 78.1828, region: 'central', distance: 1650 },
    'ujjain': { lat: 23.1765, lng: 75.7885, region: 'central', distance: 1320 },
    
    // Chennai Local Areas
    't nagar': { lat: 13.0389, lng: 80.2424, region: 'local', distance: 8 },
    'anna nagar': { lat: 13.0851, lng: 80.2103, region: 'local', distance: 10 },
    'adyar': { lat: 13.0052, lng: 80.2562, region: 'local', distance: 12 },
    'velachery': { lat: 12.9735, lng: 80.2208, region: 'local', distance: 15 },
    'omr': { lat: 12.8373, lng: 80.2267, region: 'local', distance: 25 },
    'mylapore': { lat: 13.0308, lng: 80.2682, region: 'local', distance: 6 },
    'nungambakkam': { lat: 13.0587, lng: 80.2455, region: 'local', distance: 5 },
    'egmore': { lat: 13.0791, lng: 80.2578, region: 'local', distance: 3 },
    'tambaram': { lat: 12.9245, lng: 80.1240, region: 'local', distance: 28 },
    'chromepet': { lat: 12.9481, lng: 80.1402, region: 'local', distance: 25 },
    'guindy': { lat: 13.0061, lng: 80.2119, region: 'local', distance: 12 },
    'porur': { lat: 13.0357, lng: 80.1576, region: 'local', distance: 18 },
    'sriperumbudur': { lat: 12.9682, lng: 79.9439, region: 'local', distance: 45 }
};

const FROM_CITY = 'Chennai';
const FROM_COORDINATES = { lat: 13.0827, lng: 80.2707 };

// Chennai local areas list for quick detection
const CHENNAI_LOCAL_AREAS = [
    't nagar', 'anna nagar', 'adyar', 'velachery', 'omr', 'mylapore', 
    'nungambakkam', 'egmore', 'tambaram', 'chromepet', 'guindy', 'porur', 
    'sriperumbudur', 'kodambakkam', 'alwarpet', 'gopalapuram', 'besant nagar', 
    'thiruvanmiyur', 'sholinganallur', 'perungudi', 'pallikaranai', 'medavakkam'
];

// Haversine formula for accurate distance calculation
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

// Get coordinates for a location
export const getCoordinates = (locationStr) => {
    if (!locationStr) return null;
    const loc = locationStr.toLowerCase().trim();
    
    // Direct match
    if (LOCATION_DB[loc]) return LOCATION_DB[loc];
    
    // Partial match
    for (const [city, data] of Object.entries(LOCATION_DB)) {
        if (loc.includes(city) || city.includes(loc)) return data;
    }
    return null;
};

// Check if location is in Chennai local area
export const isChennaiLocal = (locationStr) => {
    if (!locationStr) return false;
    const loc = locationStr.toLowerCase();
    return CHENNAI_LOCAL_AREAS.some(area => loc.includes(area)) || loc.includes('chennai');
};

// Get distance in km from Chennai
export const getDistanceKm = (locationStr) => {
    if (!locationStr) return 0;
    
    const locLower = locationStr.toLowerCase();
    
    // Check Chennai local areas first
    if (isChennaiLocal(locLower)) {
        // Find specific area distance
        for (const area of CHENNAI_LOCAL_AREAS) {
            if (locLower.includes(area) && LOCATION_DB[area]) {
                return LOCATION_DB[area].distance;
            }
        }
        return 15; // Default Chennai local distance
    }
    
    // Check location database
    const coords = getCoordinates(locationStr);
    if (coords && coords.distance) {
        return coords.distance;
    }
    
    // Calculate using coordinates if available
    if (coords && coords.lat && coords.lng) {
        return haversineDistance(FROM_COORDINATES.lat, FROM_COORDINATES.lng, coords.lat, coords.lng);
    }
    
    // Rough estimates based on region keywords
    if (locLower.includes('north') || locLower.includes('delhi') || locLower.includes('punjab') || locLower.includes('up')) {
        return 2200;
    }
    if (locLower.includes('west') || locLower.includes('mumbai') || locLower.includes('gujarat') || locLower.includes('rajasthan')) {
        return 1350;
    }
    if (locLower.includes('east') || locLower.includes('kolkata') || locLower.includes('bengal') || locLower.includes('bihar')) {
        return 1660;
    }
    if (locLower.includes('northeast') || locLower.includes('assam') || locLower.includes('meghalaya')) {
        return 2500;
    }
    if (locLower.includes('central') || locLower.includes('madhya') || locLower.includes('mp')) {
        return 1350;
    }
    
    return 150; // Default fallback
};

// Calculate distance with cost estimation
export const calculateDistance = (location) => {
    const km = getDistanceKm(location);
    const costPerKm = km > 500 ? 8 : km > 100 ? 10 : 12;
    const cost = Math.round(km * costPerKm);
    const deliveryTime = km > 500 ? '3-5 days' : km > 100 ? '2-3 days' : '1-2 days';
    return { km, cost, deliveryTime };
};

export const calculateCost = (km) => {
    const costPerKm = km > 500 ? 8 : km > 100 ? 10 : 12;
    return Math.round(km * costPerKm);
};

// Parse plants from text input
export const parsePlants = (plantsStr) => {
    if (!plantsStr) return [];
    return plantsStr.split(',').map(p => {
        p = p.trim();
        const m = p.match(/^(.+?)\s*[xX×]\s*(\d+)$/);
        if (m) return { name: m[1].trim(), qty: parseInt(m[2]) };
        const m2 = p.match(/^(\d+)\s*[xX×]\s*(.+)$/);
        if (m2) return { name: m2[2].trim(), qty: parseInt(m2[1]) };
        return { name: p, qty: 1 };
    }).filter(p => p.name && p.qty > 0);
};

// Split plants across team members
export const splitPlantsByPerson = (plantsStr, totalQty, numPersons) => {
    const plants = parsePlants(plantsStr);
    
    if (plants.length === 0) {
        const base = Math.floor(totalQty / numPersons);
        const extra = totalQty % numPersons;
        return Array.from({ length: numPersons }, (_, i) => ({
            plants: [],
            qty: base + (i < extra ? 1 : 0)
        }));
    }
    
    const personPlants = Array.from({ length: numPersons }, () => ({ plants: [], qty: 0 }));
    
    plants.forEach(plant => {
        const base = Math.floor(plant.qty / numPersons);
        const extra = plant.qty % numPersons;
        for (let i = 0; i < numPersons; i++) {
            const cnt = base + (i < extra ? 1 : 0);
            if (cnt > 0) {
                personPlants[i].plants.push({ name: plant.name, qty: cnt });
                personPlants[i].qty += cnt;
            }
        }
    });
    
    return personPlants;
};

// Enhanced AI Priority Score Calculation
export const calculateAIScore = (order) => {
    const { dispatchDate, leaveHr, leaveMn, leaveAmPm, qty, location, locSorted, priority } = order;
    let score = 0;
    let reasons = [];
    
    // Time-based scoring (higher priority for sooner dates)
    if (dispatchDate) {
        const today = new Date();
        const dispatch = new Date(dispatchDate);
        const diffDays = Math.ceil((dispatch - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            score += 60;
            reasons.push('⚠️ OVERDUE');
        } else if (diffDays === 0) {
            score += 55;
            reasons.push('🚨 DISPATCH TODAY');
        } else if (diffDays === 1) {
            score += 45;
            reasons.push('🔥 Tomorrow dispatch');
        } else if (diffDays <= 3) {
            score += 30;
            reasons.push('📅 This week');
        } else if (diffDays <= 7) {
            score += 20;
            reasons.push('📆 Next week');
        } else {
            score += 5;
            reasons.push(`📅 ${diffDays} days away`);
        }
    }
    
    // Time of day scoring
    if (leaveHr && leaveHr !== '') {
        let hr = parseInt(leaveHr);
        if (leaveAmPm === 'PM' && hr < 12) hr += 12;
        if (leaveAmPm === 'AM' && hr === 12) hr = 0;
        
        const currentHour = new Date().getHours();
        const hoursUntil = hr - currentHour;
        
        if (hoursUntil > 0 && hoursUntil <= 4) {
            score += 20;
            reasons.push(`⏰ Leaving in ${hoursUntil} hours`);
        } else if (hoursUntil <= 0 && hoursUntil > -2) {
            score += 30;
            reasons.push('⚠️ Past leaving time');
        }
    }
    
    // Quantity-based scoring
    const qtyNum = parseInt(qty) || 0;
    if (qtyNum >= 200) {
        score += 40;
        reasons.push(`🏭 Massive: ${qtyNum} plants`);
    } else if (qtyNum >= 100) {
        score += 30;
        reasons.push(`📦 Very large: ${qtyNum} plants`);
    } else if (qtyNum >= 50) {
        score += 20;
        reasons.push(`📦 Large: ${qtyNum} plants`);
    } else if (qtyNum >= 25) {
        score += 12;
        reasons.push(`📦 Medium: ${qtyNum} plants`);
    } else if (qtyNum >= 10) {
        score += 6;
        reasons.push(`📦 Small: ${qtyNum} plants`);
    } else if (qtyNum > 0) {
        score += 2;
        reasons.push(`🌱 Tiny: ${qtyNum} plants`);
    }
    
    // Distance-based scoring with region awareness
    const km = getDistanceKm(location);
    const isLocal = isChennaiLocal(location);
    
    if (isLocal) {
        score += 2;
        reasons.push('📍 Local Chennai delivery');
    } else if (km >= 2000) {
        score += 30;
        reasons.push(`🚚 Extreme distance: ${km}km`);
    } else if (km >= 1000) {
        score += 25;
        reasons.push(`🚚 Very far: ${km}km`);
    } else if (km >= 500) {
        score += 18;
        reasons.push(`🚚 Long distance: ${km}km`);
    } else if (km >= 100) {
        score += 10;
        reasons.push(`🚚 Far: ${km}km`);
    } else if (km >= 20) {
        score += 5;
        reasons.push(`🚚 Medium: ${km}km`);
    } else if (km > 0) {
        score += 2;
        reasons.push(`📍 Nearby: ${km}km`);
    }
    
    // Location confirmation penalty
    if (!locSorted && location && !isLocal) {
        score += 15;
        reasons.push('⚠️ Location not confirmed');
    }
    
    // Special event types
    if (order.eventType) {
        const event = order.eventType.toLowerCase();
        if (event.includes('wedding')) {
            score += 10;
            reasons.push('💒 Wedding - time sensitive');
        } else if (event.includes('corporate')) {
            score += 5;
            reasons.push('🏢 Corporate event');
        } else if (event.includes('birthday')) {
            score += 8;
            reasons.push('🎂 Birthday - date critical');
        }
    }
    
    // Determine priority based on score
    let finalPri = 'low';
    if (score >= 65) finalPri = 'high';
    else if (score >= 35) finalPri = 'med';
    
    // If manual priority is set and higher than AI, respect it
    if (priority === 'high' && finalPri !== 'high' && score > 40) {
        finalPri = 'high';
        reasons.push('👤 Manual override: Urgent');
    }
    
    return { 
        score: Math.min(score, 100), 
        pri: finalPri, 
        reasons: reasons.join(' | ') 
    };
};

// Format date for display
export const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]}${y ? `, ${y}` : ''}`;
};

// Format date for input fields
export const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 10);
};

// Get next 7 days for date tabs
export const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().slice(0, 10));
    }
    return days;
};

// Priority styling helpers
export const getPriorityClass = (priority) => {
    return priority === 'high' ? 'urgent' : priority === 'med' ? 'medium' : 'standard';
};

export const getPriorityLabel = (priority) => {
    return priority === 'high' ? 'Urgent' : priority === 'med' ? 'Medium' : 'Standard';
};

// Get delivery estimate based on distance
export const getDeliveryEstimate = (km) => {
    if (km === 0) return 'Same day';
    if (km <= 50) return '1 day';
    if (km <= 200) return '2 days';
    if (km <= 500) return '3 days';
    if (km <= 1000) return '4-5 days';
    return '5-7 days';
};

// Format region name
export const getRegion = (locationStr) => {
    const coords = getCoordinates(locationStr);
    if (coords && coords.region) {
        const regions = {
            'south': 'South India',
            'west': 'West India',
            'north': 'North India',
            'east': 'East India',
            'central': 'Central India',
            'northeast': 'North-East India',
            'local': 'Chennai Local'
        };
        return regions[coords.region] || 'India';
    }
    
    if (isChennaiLocal(locationStr)) return 'Chennai Local';
    return 'India';
};