// Helpers
const extractUserInfo = (obj) => {
  let key = Object.keys(obj);
  let name = obj[key].name;
  let email = obj[key].email;
  let picture = obj[key].picture;
  return [name, email, picture];
}

const location = (obj) => {
  let key = Object.keys(obj);
  let latitude = obj[key].homeLat;
  let longitude = obj[key].homeLong;
  return [latitude, longitude];
} 

const alertLocations = (obj) => {
  let key = Object.keys(obj);
  let lat = obj[key].latitude;
  let long = obj[key].longitude;
  return [lat, long];
}

const alertDetails = (obj) => {
  let key = Object.keys(obj);
  let category = obj[key].category;
  let photo = obj[key].url;
  return [category, photo];
}

const distance = (lat1, lon1, lat2, lon2) => {
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2)
           + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

// Is event near user
const dataParser = (object) => {
  let keys = Object.keys(object);
  const userData = object[keys[0]];
  const friendData = object[keys[1]];
  const alertData = object[keys[2]];
   
  const user = extractUserInfo(userData);
  const userLoc =  location(userData);
  const alertLoc = alertLocations(alertData);
  const alert = alertDetails(alertData);

  if (distance(alertLoc[0], alertLoc[1], userLoc[0], userLoc[1]) < 10) {
    return user.concat(alert);
  }
  return null;
};

exports.dataParser = dataParser;
