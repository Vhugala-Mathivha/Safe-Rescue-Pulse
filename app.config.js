const appJson = require('./app.json');

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

module.exports = () => {
  if (!googleMapsApiKey) {
    console.warn('GOOGLE_MAPS_API_KEY is not set; Android react-native-maps will not load in standalone builds.');
  }

  return {
    ...appJson.expo,
    plugins: [
      ...(appJson.expo.plugins || []),
      ...(googleMapsApiKey
        ? [['react-native-maps', { androidGoogleMapsApiKey: googleMapsApiKey }]]
        : []),
    ],
  };
};
