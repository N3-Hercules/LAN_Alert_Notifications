// let sample = [ [ { id: 1,
//   name: 'Nicolas Turner',
//   email: 'nicolasrturner@gmail.com',
//   provider: 'google',
//   provider_id: 2147483647,
//   picture: 'https://lh6.googleusercontent.com/-l_N2cyMTHkE/AAAAAAAAAAI/AAAAAAAAAAs/gKIXkyIgaAs/s96-c/photo.jpg',
//   token: 0,
//   homeLat: '47.72155850000000000000',
//   homeLong: '-122.19219729999999000000',
//   createdAt: '2018-10-13T19:27:56.000Z',
//   updatedAt: '2018-10-14T02:02:01.000Z' } ],
// [ { id: 871,
//   latitude: '47.72154930000000000000',
//   longitude: '-122.19222980000000000000',
//   notes: '',
//   category: 'tsunami',
//   url: null,
//   photoTag: '',
//   createdAt: '2018-10-16T02:46:07.000Z',
//   updatedAt: '2018-10-16T02:46:07.000Z',
//   EventId: null,
//   UserId: null } ],
// [ { id: 11,
//   name: 'Nathan Vang',
//   email: 'vang.nathany@gmail.com',
//   provider: 'google',
//   provider_id: 2147483647,
//   picture: 'https://lh3.googleusercontent.com/-8xSRfi__hF0/AAAAAAAAAAI/AAAAAAAAAAA/AAN31DVAndCid6xmJab1eFvt0zRcJIjZIg/s96-c/photo.jpg',
//   token: 0,
//   homeLat: '37.72235900000000000000',
//   homeLong: '-122.15841540000000000000',
//   createdAt: '2018-10-13T19:29:12.000Z',
//   updatedAt: '2018-10-13T19:30:36.000Z' },
// { id: 41,
//   name: 'nathan ong',
//   email: 'nathan.d.ong@gmail.com',
//   provider: 'google',
//   provider_id: 2147483647,
//   picture: 'https://lh5.googleusercontent.com/-YsUz_PcvkmY/AAAAAAAAAAI/AAAAAAAAAB4/DMaf7nsMRm4/s96-c/photo.jpg',
//   token: 0,
//   homeLat: '37.72235900000000000000',
//   homeLong: '-122.15841540000000000000',
//   createdAt: '2018-10-13T22:41:15.000Z',
//   updatedAt: '2018-10-15T15:19:05.000Z' } ] ]
// New data flow schema = user, alert, friends[?]

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
    impacted: false,
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

  if (distance(data.latitude, data.longitude, user.homeLat, user.homeLong) < 10) {
    console.log('User is impacted');
    user.impacted = true;
    console.log(user);
  }

  if (friends.length) {
    for (let i = 0; i < data.homeLat.length; ++i) {
      if (distance(data.latitude, data.longitude, data.homeLat, data.homeLong) < 10) {
        friends.impacted = true;
      }
    }
  }

  if (user.impacted) {
    return { user, data };
  }
  if (friends.impacted) {
    return { user, data, friends };
  }
  return null;
};

// console.log(dataParser(sample));

exports.dataParser = dataParser;
