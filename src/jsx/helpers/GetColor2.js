// Define a color mapping function based on value (special cases dealt with by getColor)
function getColorFromValue(dep_code, type) {
  // Return grey if value is null, NaN, or undefined
  if (type === 'all') {
    if (dep_code === 1) {
      return '#72BF44';
    }
    if (dep_code === 2) {
      return '#009edb';
    }
    if (dep_code === 3) {
      return '#FBAF17';
    }
    if (dep_code === 0) {
      return '#AEA29A';
    }
    return '#DED9D5';
  }
  return '#DED9D5';
}

// Define a color mapping function based on value **and code**
const getColor = (value, code, data, type, dependency) => {
  const AksaiChin = 'C00002'; // code for disputed area Aksai Chin
  const ArunachalPradesh = 'C00003'; // code for disputed area Aksai Chin
  const Kosovo = '412';
  const Taiwan = '158';
  const HongKong = '344';
  const Macao = '446';

  // First check if this code is special
  if (code === AksaiChin) {
    const kashmirData = data.find(item => item.code === 'C00007'); // Find kashmir in data
    const kashmirValue = kashmirData ? kashmirData[type] : null; // Get kashmir's value, default to null
    const chinaData = data.find(item => item.code === '156'); // Find china in data
    const chinaValue = chinaData ? chinaData[type] : null; // Get china's value, default to null
    return {
      pattern: {
        backgroundColor: getColorFromValue(kashmirValue, type, dependency),
        color: getColorFromValue(chinaValue, type, dependency),
        height: 10, // Height of the pattern
        path: {
          d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
          strokeWidth: 2.5 * Math.sqrt(2),
        },
        width: 10 // Width of the pattern
      }
    };
  }
  // First check if this code is special
  if (code === ArunachalPradesh) {
    const indiaData = data.find(item => item.code === '356'); // Find china in data
    const indiaValue = indiaData ? indiaData[type] : null; // Get china's value, default to null
    return getColorFromValue(indiaValue, type, dependency);
  }
  // First check if this code is special
  if (code === Kosovo) {
    const serbiaData = data.find(item => item.code === '688'); // Find Serbia in data
    const serbiaValue = serbiaData ? serbiaData[type] : null; // Get Serbia's value, default to null
    return getColorFromValue(serbiaValue, type, dependency);
  }
  // First check if this code is special
  if (code === Taiwan || code === HongKong || code === Macao) {
    const chinaData = data.find(item => item.code === '156'); // Find Serbia in data
    const chinaValue = chinaData ? chinaData[type] : null; // Get Serbia's value, default to null
    return getColorFromValue(chinaValue, type, dependency);
  }

  return getColorFromValue(value, type, dependency);
};

export default getColor;
