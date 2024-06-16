import express from 'express';
import fetchJson from './helpers/fetch-json.js';

const apiUrl = 'https://dtnl-frontend-case.vercel.app/api/';
const forecastUrl = `${apiUrl}get-forecast`;
const currentWeatherUrl = `${apiUrl}get-weather`;
const thingsToDoUrl = `${apiUrl}get-things-to-do`;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const [forecastData, currentWeatherData, thingsToDoData] = await Promise.all([
      fetchJson(forecastUrl),
      fetchJson(currentWeatherUrl),
      fetchJson(thingsToDoUrl)
    ]);

    res.render('index', {
      allcast: forecastData.forecast || [],
      weather: currentWeatherData.temperature || [],
      weatherinfo: currentWeatherData.weatherInfo || {},
      thingsToDo: thingsToDoData.activities || []
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data.');
  }
});

const port = process.env.PORT || 8000;
app.set('port', port);

app.listen(port, () => {
  console.log(`Application started on http://localhost:${port}`);
});
