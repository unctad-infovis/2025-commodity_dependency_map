function getColorAxis(type) {
  if (type === 'all') {
    return {
      dataClasses: [{
        color: '#E3EDF6', name: '0–20%'
      }, {
        color: '#C5DFEF', name: '20–40%'
      }, {
        color: '#009EDB', name: '40–60%'
      }, {
        color: '#0077B8', name: '60–80%'
      }, {
        color: '#004987', name: '80–100%'
      }]
    };
  }
  let label = '';
  if (type === 'agriculture') {
    label = 'agriculture exports';
  } else if (type === 'energy') {
    label = 'energy exports';
  } else if (type === 'mining') {
    label = 'minerals, ores and metals export';
  }
  return {
    dataClasses: [{
      color: '#009EDB', name: `Countries dependent on ${label}`
    }, {
      color: '#DED9D5', name: 'Other countries',
    }]
  };
}
export default getColorAxis;
