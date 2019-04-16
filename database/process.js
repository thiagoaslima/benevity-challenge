const fs = require('fs');
const path = require('path');

// NORMALIZE CODE
// Keeps the same on CitiesService to normalize search term
function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '');
}

fs.readFile('./city.list.json', 'utf8', (err, data) => {
  console.log(err ? err : 'read correctly');

  try {
    const original = JSON.parse(data);
    const content = original
      .slice()
      .sort((a, b) => {
        if (a.country === b.country) {
          return a.name > b.name ? 1 : -1;
        }
        return a.country > b.country ? 1 : -1;
      })
      .reduce((acc, { id, name, country }, idx) => {
        const slug = normalize(name);
        const key1 = slug;
        const key2 = [slug, String(idx).padStart(7, '0')].join('');

        if (country && slug && slug.length >= 3) {
            // Key1 just used to back compatibility
          acc.cities[key1] = { id, name, country };
          acc.cities2[key2] = { id, name, country };
        }
        return acc;
      }, {cities: {}, cities2: {}});

    fs.writeFile(
      path.resolve(__dirname, 'firebase-cities.json'),
      JSON.stringify(content, null, 2),
      err => {
        console.log(err ? err : 'Saved successfully');
      }
    );

    fs.writeFile(
      path.resolve(__dirname, 'cities-name.json'),
      JSON.stringify(Object.keys(content.cities2), null, 2),
      err => {
        console.log(err ? err : 'Saved successfully');
      }
    );
  } catch (err) {
    console.log(err);
  }
});
