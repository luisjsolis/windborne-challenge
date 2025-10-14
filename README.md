# WindBorne Balloon Constellation Tracker

An interactive web application that visualizes WindBorne Systems' weather balloon constellation data combined with atmospheric weather information.

## 🌟 Features

- **Real-time Balloon Tracking**: Visualize the current positions of WindBorne's global sounding balloons
- **24-Hour Flight History**: Animate through the last 24 hours of balloon movement data
- **Interactive Map**: Click on balloons to see detailed position and altitude information
- **Trajectory Visualization**: Select balloons to view their complete 24-hour flight paths
- **Weather Integration**: Get weather data for balloon locations (demo implementation)
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Live Demo

[View the live application here](https://your-deployment-url.com)

## 🛠️ Technical Implementation

### Data Sources

1. **WindBorne Constellation API**: 
   - Current positions: `https://a.windbornesystems.com/treasure/00.json`
   - Historical data: `01.json` through `23.json` (1-23 hours ago)
   - Data format: Array of `[latitude, longitude, altitude]` coordinates

2. **Weather Data Integration**:
   - Combined with weather APIs to provide atmospheric context
   - Shows temperature, humidity, pressure, and wind conditions at balloon locations
   - Enhances understanding of atmospheric conditions affecting balloon flight

### Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Mapping**: Leaflet.js for interactive maps
- **Data Visualization**: Custom trajectory plotting and real-time animations
- **Responsive Design**: CSS Grid and Flexbox for mobile-friendly layout

### Key Features

- **Robust Data Handling**: Gracefully handles corrupted or missing data from the API
- **Real-time Updates**: Automatically refreshes with latest balloon positions
- **Interactive Controls**: Play/pause animation, time slider, balloon selection
- **Performance Optimized**: Efficient rendering of large datasets with smooth animations

## 🎯 Why This Combination?

I chose to combine WindBorne's balloon data with weather information because:

1. **Scientific Synergy**: Weather balloons are specifically designed to collect atmospheric data, so combining their positions with weather conditions provides valuable insights into atmospheric dynamics.

2. **Educational Value**: This combination helps visualize how weather patterns affect balloon flight paths and how balloons can be used to study atmospheric phenomena.

3. **Real-world Application**: Understanding the relationship between balloon positions and weather conditions is crucial for meteorologists and atmospheric scientists.

4. **Interactive Learning**: The visualization makes complex atmospheric data accessible and engaging for both experts and the general public.

## 🔧 Setup Instructions

1. Clone or download the project files
2. Open `index.html` in a web browser
3. The application will automatically load balloon data from WindBorne's API

## 📊 Data Analysis

The application provides real-time analysis including:
- Total number of active balloons
- Average altitude across the constellation
- Total data points collected
- Flight trajectory distances
- Weather conditions at balloon locations

## 🌐 Deployment

This application is designed to be deployed on any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Simply upload the files and configure the hosting service to serve `index.html` as the entry point.

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

This project was created as part of the WindBorne Systems Junior Web Developer application challenge. The code is open source and available for educational purposes.

## 📄 License

MIT License - feel free to use and modify for educational purposes.
