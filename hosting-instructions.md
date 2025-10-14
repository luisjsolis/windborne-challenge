# Hosting Instructions for WindBorne Challenge

## Quick Deployment Options

### Option 1: Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire `windborne-challenge` folder
3. Your app will be live at a URL like `https://amazing-name-123456.netlify.app`

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your project or drag and drop the folder
3. Deploy automatically

### Option 3: GitHub Pages
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select source as "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Your app will be at `https://yourusername.github.io/repository-name`

### Option 4: Surge.sh (Command Line)
```bash
npm install -g surge
cd windborne-challenge
surge
# Follow the prompts to deploy
```

## Local Testing
```bash
cd windborne-challenge
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

## Files Included
- `index.html` - Main application file
- `styles.css` - Styling and responsive design
- `app.js` - JavaScript application logic
- `README.md` - Project documentation
- `package.json` - Project configuration
- `deploy.sh` - Deployment script

## Features Demonstrated
✅ Queries WindBorne constellation API (00.json through 23.json)
✅ Robust error handling for corrupted/missing data
✅ Combines with weather data for atmospheric insights
✅ Interactive map with balloon tracking
✅ 24-hour flight history visualization
✅ Real-time updates and animations
✅ Responsive design for all devices
✅ Publicly accessible URL ready for submission

## API Integration
- **Primary**: WindBorne Systems constellation API
- **Secondary**: Weather data integration (demo implementation)
- **Rationale**: Weather balloons + weather data = perfect atmospheric science combination
