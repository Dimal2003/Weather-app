import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

// Configure CORS to allow all origins with more specific settings
app.use(cors({
  origin: true, // Allow all origins
  credentials: false, // Set to false for simple requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add preflight handler
app.options('*', cors());

// Serve static files
app.use(express.static(__dirname));

// Check if API key is configured
if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
  console.error('ERROR: API_KEY not configured in .env file');
  console.error('Please get your API key from https://openweathermap.org/');
  console.error('Then update the .env file with: API_KEY=your_actual_key_here');
  process.exit(1);
}

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }
  
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lang=al&units=metric&q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("API response:", data); // Log the API response for debugging
    
    if (data.cod === "404" || data.cod === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    
    if (data.cod === "401" || data.cod === 401) {
      console.error("API Key Error:", data.message);
      return res.status(401).json({ error: "Invalid API key. Please check your OpenWeatherMap API key." });
    }
    
    res.json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Weather API endpoint: http://localhost:${PORT}/weather`);
  console.log(`Open your browser and go to: http://localhost:${PORT}`);
});
