const express = require('express');
const app = express();
const path = require('path')
const fetch = require('isomorphic-fetch')

const openWeatherMap = (zipCode) => {
  const apiKey = '6b3be64de0cd495a53cdef4cef58eb2d'
  let requestUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=${apiKey}&units=imperial` 
  return fetch(requestUrl)
  .then((response) => {
    if(response.status < 400) {
      return response.json()
    } else {
      throw new Error('Could not get weather')
    }
  })
  .then((json) => {
    let temp = json
    let parsedData = {
      city: json.name,
      temp: json.main.temp,
      lat: json.coord.lat,
      lon: json.coord.lon,
      zipCode
    }
    return parsedData
  })
}

const googleTimeZone = (data) => {
  const apiKey = 'AIzaSyBff2hxbYKHsG5inVuFBr_MhVlOAlT_1Rc'
  let requestUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${data.lat},${data.lon}&key=${apiKey}`

  return fetch(requestUrl)
  .then((response) => {
    if(response.status < 400)  {
      return response.json()
    } else {
      throw new Error('Could not get timezone')
    }
  })
  .then((json) => {
    console.log(json)
    data.timeZone = json.timeZoneName
    return data
  })
}

const getData = (zipCode) => {
  openWeatherMap(zipCode)
  .then(googleTimeZone)
  .then((data) => {})
}

app.use(express.static(path.join(__dirname, 'public')))
// reply to request with "Hello World!"
app.get('/getTimeAndWeather', function (req, res) {
  const zipCode = req.query.zipCode
  if(!zipCode) {
    res.status(401).send()
    return
  }
  openWeatherMap(zipCode)
  .then(googleTimeZone)
  .then((data) => {
    console.log(data)
    res.status(200).json(data)
  })
  .catch((error) => {
    console.log(error)
    res.status(500).send(error)
  })
});

//start a server on port 80 and log its start to our console
const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log('Find your zip code on port', port);
});
