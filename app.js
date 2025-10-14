class BalloonTracker {
    constructor() {
        this.map = null;
        this.balloonData = [];
        this.weatherData = new Map();
        this.selectedBalloons = new Set();
        this.currentTimeIndex = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.markers = [];
        this.trajectories = [];
        
        this.init();
    }

    async init() {
        this.initMap();
        await this.loadBalloonData();
        this.setupEventListeners();
        this.updateDisplay();
        this.hideLoading();
    }

    initMap() {
        this.map = L.map('map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    async loadBalloonData() {
        const promises = [];
        
        // Load data for the last 24 hours (00.json to 23.json)
        for (let i = 0; i < 24; i++) {
            const timeIndex = i.toString().padStart(2, '0');
            promises.push(this.fetchBalloonData(timeIndex));
        }
        
        try {
            const results = await Promise.allSettled(promises);
            this.processBalloonData(results);
        } catch (error) {
            console.error('Error loading balloon data:', error);
            this.showError('Failed to load balloon data');
        }
    }

    async fetchBalloonData(timeIndex) {
        try {
            const response = await fetch(`https://a.windbornesystems.com/treasure/${timeIndex}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return { timeIndex: parseInt(timeIndex), data };
        } catch (error) {
            console.warn(`Failed to fetch data for time index ${timeIndex}:`, error);
            return { timeIndex: parseInt(timeIndex), data: null, error: error.message };
        }
    }

    processBalloonData(results) {
        this.balloonData = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.data) {
                const { timeIndex, data } = result.value;
                this.balloonData[timeIndex] = data.map((balloon, balloonIndex) => ({
                    id: balloonIndex,
                    lat: balloon[0],
                    lng: balloon[1],
                    altitude: balloon[2],
                    timeIndex: timeIndex
                }));
            } else {
                // Handle corrupted or missing data
                console.warn(`No data available for time index ${index}`);
                this.balloonData[index] = [];
            }
        });
        
        this.calculateTrajectories();
    }

    calculateTrajectories() {
        this.trajectories = [];
        const maxBalloons = Math.max(...this.balloonData.map(data => data ? data.length : 0));
        
        for (let balloonId = 0; balloonId < maxBalloons; balloonId++) {
            const trajectory = [];
            
            for (let timeIndex = 0; timeIndex < 24; timeIndex++) {
                const timeData = this.balloonData[timeIndex];
                if (timeData && timeData[balloonId]) {
                    trajectory.push([timeData[balloonId].lat, timeData[balloonId].lng]);
                }
            }
            
            if (trajectory.length > 1) {
                this.trajectories[balloonId] = trajectory;
            }
        }
    }

    setupEventListeners() {
        const timeSlider = document.getElementById('timeSlider');
        const playPauseBtn = document.getElementById('playPause');
        const resetBtn = document.getElementById('reset');

        timeSlider.addEventListener('input', (e) => {
            this.currentTimeIndex = parseInt(e.target.value);
            this.updateDisplay();
        });

        playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        resetBtn.addEventListener('click', () => {
            this.resetToCurrent();
        });
    }

    togglePlayPause() {
        const playPauseBtn = document.getElementById('playPause');
        
        if (this.isPlaying) {
            clearInterval(this.playInterval);
            this.isPlaying = false;
            playPauseBtn.textContent = '▶️ Play';
        } else {
            this.isPlaying = true;
            playPauseBtn.textContent = '⏸️ Pause';
            this.playInterval = setInterval(() => {
                this.currentTimeIndex = (this.currentTimeIndex + 1) % 24;
                document.getElementById('timeSlider').value = this.currentTimeIndex;
                this.updateDisplay();
            }, 1000);
        }
    }

    resetToCurrent() {
        this.currentTimeIndex = 0;
        document.getElementById('timeSlider').value = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateMap();
        this.updateStats();
        this.updateTimeDisplay();
    }

    updateMap() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        const currentData = this.balloonData[this.currentTimeIndex];
        if (!currentData) return;

        // Add markers for current time
        currentData.forEach((balloon, index) => {
            const marker = L.circleMarker([balloon.lat, balloon.lng], {
                radius: 8,
                fillColor: this.getBalloonColor(balloon.altitude),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            marker.bindPopup(`
                <div class="balloon-popup">
                    <h4>Balloon #${balloon.id}</h4>
                    <p><strong>Position:</strong> ${balloon.lat.toFixed(4)}, ${balloon.lng.toFixed(4)}</p>
                    <p><strong>Altitude:</strong> ${balloon.altitude.toFixed(2)} km</p>
                    <p><strong>Time:</strong> ${this.getTimeLabel(this.currentTimeIndex)}</p>
                    <button onclick="balloonTracker.selectBalloon(${balloon.id})">Track Trajectory</button>
                </div>
            `);

            marker.on('click', () => {
                this.fetchWeatherData(balloon.lat, balloon.lng);
            });

            this.markers.push(marker);
        });

        // Update trajectory display
        this.updateTrajectories();
    }

    updateTrajectories() {
        // Clear existing trajectory lines
        this.trajectories.forEach(trajectory => {
            if (trajectory.layer) {
                this.map.removeLayer(trajectory.layer);
            }
        });

        // Show trajectories for selected balloons
        this.selectedBalloons.forEach(balloonId => {
            const trajectory = this.trajectories[balloonId];
            if (trajectory && trajectory.length > 1) {
                const polyline = L.polyline(trajectory, {
                    color: '#667eea',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(this.map);
                
                this.trajectories[balloonId].layer = polyline;
            }
        });
    }

    selectBalloon(balloonId) {
        if (this.selectedBalloons.has(balloonId)) {
            this.selectedBalloons.delete(balloonId);
        } else {
            this.selectedBalloons.add(balloonId);
        }
        this.updateTrajectories();
        this.updateTrajectoryInfo();
    }

    getBalloonColor(altitude) {
        // Color based on altitude: blue (low) to red (high)
        const normalized = Math.min(altitude / 30, 1);
        const hue = (1 - normalized) * 240; // Blue to red
        return `hsl(${hue}, 70%, 50%)`;
    }

    getTimeLabel(timeIndex) {
        if (timeIndex === 0) return 'Current';
        return `${timeIndex} hour${timeIndex > 1 ? 's' : ''} ago`;
    }

    async fetchWeatherData(lat, lng) {
        try {
            // Using a free weather API (OpenWeatherMap requires API key, so using a mock for demo)
            // In a real implementation, you'd use a proper weather API
            const mockWeatherData = {
                temperature: Math.round(20 + Math.random() * 20 - 10),
                humidity: Math.round(30 + Math.random() * 40),
                pressure: Math.round(1000 + Math.random() * 50),
                windSpeed: Math.round(Math.random() * 20),
                description: ['Clear', 'Cloudy', 'Partly Cloudy', 'Overcast'][Math.floor(Math.random() * 4)]
            };

            this.displayWeatherInfo(lat, lng, mockWeatherData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.displayWeatherInfo(lat, lng, {
                temperature: 'N/A',
                humidity: 'N/A',
                pressure: 'N/A',
                windSpeed: 'N/A',
                description: 'Weather data unavailable'
            });
        }
    }

    displayWeatherInfo(lat, lng, weather) {
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = `
            <div class="weather-detail">
                <h4>Weather at ${lat.toFixed(2)}, ${lng.toFixed(2)}</h4>
                <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
                <p><strong>Humidity:</strong> ${weather.humidity}%</p>
                <p><strong>Pressure:</strong> ${weather.pressure} hPa</p>
                <p><strong>Wind Speed:</strong> ${weather.windSpeed} m/s</p>
                <p><strong>Conditions:</strong> ${weather.description}</p>
            </div>
        `;
    }

    updateStats() {
        const currentData = this.balloonData[this.currentTimeIndex] || [];
        const totalDataPoints = this.balloonData.reduce((sum, data) => sum + (data ? data.length : 0), 0);
        const avgAltitude = currentData.length > 0 
            ? currentData.reduce((sum, balloon) => sum + balloon.altitude, 0) / currentData.length 
            : 0;

        document.getElementById('balloonCount').textContent = currentData.length;
        document.getElementById('avgAltitude').textContent = avgAltitude.toFixed(2);
        document.getElementById('dataPoints').textContent = totalDataPoints;
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        timeDisplay.textContent = this.getTimeLabel(this.currentTimeIndex);
    }

    updateTrajectoryInfo() {
        const trajectoryInfo = document.getElementById('trajectoryInfo');
        
        if (this.selectedBalloons.size === 0) {
            trajectoryInfo.innerHTML = '<p>Select balloons to view their 24-hour flight paths</p>';
            return;
        }

        let info = '<h4>Selected Balloons:</h4>';
        this.selectedBalloons.forEach(balloonId => {
            const trajectory = this.trajectories[balloonId];
            if (trajectory) {
                const distance = this.calculateTrajectoryDistance(trajectory);
                info += `<p>Balloon #${balloonId}: ${trajectory.length} points, ~${distance.toFixed(0)}km traveled</p>`;
            }
        });
        
        trajectoryInfo.innerHTML = info;
    }

    calculateTrajectoryDistance(trajectory) {
        let distance = 0;
        for (let i = 1; i < trajectory.length; i++) {
            const prev = trajectory[i - 1];
            const curr = trajectory[i];
            distance += this.calculateDistance(prev[0], prev[1], curr[0], curr[1]);
        }
        return distance;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div style="color: #ff6b6b; text-align: center;">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 20px;">Retry</button>
            </div>
        `;
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Initialize the application
let balloonTracker;
document.addEventListener('DOMContentLoaded', () => {
    balloonTracker = new BalloonTracker();
});
