
// Find out if user or friends are impacted by alert
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
  const user = {
    name: '',
    email: '',
    homeLat: '',
    homeLong: '',
    impacted: false,
  };
  // Extract main user data
  JSON.stringify(object[0], (key, value) => {
    if (key === 'name') return user.name = value;
    if (key === 'email') return user.email = value;
    if (key === 'homeLat') return user.homeLat = value;
    if (key === 'homeLong') return user.homeLong = value;
    return value;
  });

  const friends = {
    users: [],
    emails: [],
    homeLat: [],
    homeLong: [],
  };

  const data = {
    category: [],
    photo: '',
    latitude: [],
    longitude: [],
  };

  JSON.stringify(object, (key, value) => {
    if (key === 'name') return friends.users.push(value);
    if (key === 'email') return friends.emails.push(value);
    if (key === 'homeLat') return friends.homeLat.push(value);
    if (key === 'homeLong') return friends.homeLong.push(value);
    if (key === 'category') return data.category.push(value);
    if (key === 'latitude') return data.latitude.push(value);
    if (key === 'longitude') return data.longitude.push(value);
    if (key === 'url') data.photo = value;
    return value;
  });

  friends.users.shift();
  friends.emails.shift();
  friends.homeLat.shift();
  friends.homeLong.shift();

  const impactedFriends = {
    users: [],
    emails: [],
    impacted: false,
  };

  if (friends.users.length) {
    console.log('Friends impacted')
    for (let i = 0; i < friends.users.length; ++i) {

      if (distance(data.latitude, data.longitude, friends.homeLat[i], friends.homeLong[i]) < 10) {
        impactedFriends.users.push(friends.users[i]);
        impactedFriends.emails.push(friends.emails[i]);
        impactedFriends.impacted = true;
      }
    }
  }
  console.log('Friends that were impacted:', impactedFriends.users);

  if (distance(data.latitude, data.longitude, user.homeLat, user.homeLong) < 10) {
    console.log('User is impacted');
    user.impacted = true;
    // console.log(user);
  }

  if (user.impacted) {
    return { user, data, impactedFriends };
  }
  if (impactedFriends.impacted) {
    return { user, data, impactedFriends };
  }
  return null;
};

// console.log(dataParser(sample));

exports.dataParser = dataParser;
