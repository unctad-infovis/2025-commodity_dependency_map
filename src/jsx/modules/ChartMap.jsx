import React, {
  forwardRef, useEffect, useCallback/* , useRef */
} from 'react';
import PropTypes from 'prop-types';

// https://www.highcharts.com/
import Highcharts from 'highcharts';
import 'highcharts/modules/map';
import 'highcharts/modules/accessibility';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/pattern-fill';

import processTopoObjectPolygons from '../helpers/ProcessTopoObjectPolygons.js';
import processTopoObject from '../helpers/ProcessTopoObject.js';
import createMaplineSeries from '../helpers/CreateMaplineSeries.js';
import getColor from '../helpers/GetColor.js';
import getColorAxis from '../helpers/GetColorAxis.js';

// https://www.npmjs.com/package/uuid4
// import { v4 as uuidv4 } from 'uuid';

const ChartMap = forwardRef((props, ref) => {
  const createMap = useCallback((data, type, topology) => {
    const plainborders = processTopoObject(topology, 'plain-borders');
    const dashedborders = processTopoObject(topology, 'dashed-borders');
    const dottedborders = processTopoObject(topology, 'dotted-borders');
    const dashdottedborders = processTopoObject(topology, 'dash-dotted-borders');

    const economiescolor = processTopoObjectPolygons(topology, 'economies-color');
    const economies = processTopoObjectPolygons(topology, 'economies');

    // Prepare a mapping of code -> labelen, labelfr from topology
    const labelMap = topology.objects.economies.geometries.reduce((mapLabel, geometry) => {
      const { code, labelen, labelfr } = geometry.properties; // Extract properties from geometry
      mapLabel[code] = { labelen, labelfr }; // Map code to labelen and labelfr
      return mapLabel;
    }, {});
    // Manually insert European Union label
    labelMap['918'] = {
      labelen: 'European Union',
      labelfr: 'Union européenne'
    };

    const pointFormat = (data_type) => {
      if (data_type === 'all') {
        return '<strong>All: {point.value:.1f}%</strong><br />Agriculture: {point.agriculture:.1f}%<br />Energy: {point.energy:.1f}%<br />Mining: {point.mining:.1f}%';
      }
      if (data_type === 'agriculture') {
        return 'All: {point.value:.1f}%<br /><strong>Agriculture: {point.agriculture:.1f}%</strong><br />Energy: {point.energy:.1f}%<br />Mining: {point.mining:.1f}%';
      }
      if (data_type === 'energy') {
        return 'All: {point.value:.1f}%<br />Agriculture: {point.agriculture:.1f}%<br /><strong>Energy: {point.energy:.1f}%</strong><br />Mining: {point.mining:.1f}%';
      }
      if (data_type === 'mining') {
        return 'All: {point.value:.1f}%<br />Agriculture: {point.agriculture:.1f}%<br />Energy: {point.energy:.1f}%<br /><strong>Mining: {point.mining:.1f}%</strong>';
      }
      return 'All: {point.value:.1f}%<br />Agriculture: {point.agriculture:.1f}%<br />Energy: {point.energy:.1f}%<br />Mining: {point.mining:.1f}%';
    };

    Highcharts.setOptions({
      lang: {
        decimalPoint: '.',
        downloadCSV: 'Download CSV data',
        thousandsSep: ' '
      }
    });
    ref.current = Highcharts.mapChart('map_container', {
      caption: {
        align: 'left',
        margin: 15,
        style: {
          color: 'rgba(0, 0.0, 0.0, 0.8)',
          fontSize: '13px'
        },
        text: '<em>Source:</em> UN Trade and Development (UNCTAD), 2025<br /><em>Note:</em> In the case of two countries (Togo and United Arab Emirates), it was not possible to consistently identify the dominant commodity group due to the presence of large volumes of exports of manufactured products that may partially or totally be re-exports. <a href="https://unctad.org/page/map-disclaimer" target="_blank">Map disclaimer</a>',
        useHTML: true,
        verticalAlign: 'bottom',
        x: 0
      },
      chart: {
        backgroundColor: '#f4f9fd',
        height: Math.max((document.getElementById('map_container').offsetWidth * 9) / 16, 400),
        type: 'map'
      },
      colorAxis: getColorAxis(type),
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      legend: {
        align: 'left',
        enabled: true,
        events: {
          itemClick() {
            return false;
          }
        },
        itemDistance: 10,
        itemStyle: {
          cursor: 'default',
          fontSize: '15px',
          fontWeight: 400
        },
        verticalAlign: 'top'
      },
      mapNavigation: {
        buttonOptions: {
          verticalAlign: 'bottom'
        },
        enabled: true
      },
      plotOptions: {
        mapline: {
          lineWidth: 0.33,
          tooltip: {
            enabled: false
          }
        },
        series: {
          point: {
            events: {
              mouseOver() {
                const element = this;
                if (element.id === 'C00003') {
                  return false;
                }
                if (element.id === '156') {
                  const { chart } = element.series;
                  chart.get('156').setState('hover');
                  chart.get('158').setState('hover');
                  chart.get('344').setState('hover');
                  chart.get('446').setState('hover');
                }
                if (element.id === '158') {
                  const { chart } = element.series;
                  chart.get('156').setState('hover');
                  chart.get('344').setState('hover');
                  chart.get('446').setState('hover');
                }
                if (element.id === '344') {
                  const { chart } = element.series;
                  chart.get('156').setState('hover');
                  chart.get('158').setState('hover');
                  chart.get('446').setState('hover');
                }
                if (element.id === '446') {
                  const { chart } = element.series;
                  chart.get('156').setState('hover');
                  chart.get('158').setState('hover');
                  chart.get('344').setState('hover');
                }
                return true;
              },
              mouseOut() {
                const element = this;
                const { chart } = element.series;
                chart.get('156').setState('');
                chart.get('158').setState('');
                chart.get('344').setState('');
                chart.get('446').setState('');
              }
            }
          }
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            title: {
              style: {
                fontSize: '26px',
                lineHeight: '30px'
              }
            }
          },
          condition: {
            maxWidth: 500
          }
        }]
      },
      series: [
        {
          data: economiescolor.map(region => {
            const match = data.find(row => row.code === region.properties.code);
            const value = match ? parseFloat(match[type]) : null;
            const agriculture = match ? parseFloat(match.agriculture) : null;
            const energy = match ? parseFloat(match.energy) : null;
            const mining = match ? parseFloat(match.mining) : null;
            const dependency = match ? match.dependency : null;
            const { code } = region.properties; // Store region code
            let labelen = code;
            if (['158', '344', '446'].includes(code)) {
              labelen = 'China';
            } else if (labelMap[code]) {
              labelen = labelMap[code].labelen;
            }
            return {
              agriculture,
              borderWidth: 0,
              color: getColor(value, code, data, type, dependency),
              energy,
              geometry: region.geometry,
              id: code,
              mining,
              name: labelen,
              value
            };
          }),
          enableMouseTracking: true,
          name: 'Economies-colour',
          states: {
            hover: {
              borderColor: '#fff',
              borderWidth: 3
            }
          },
          visible: true,
          type: 'map'
        },
        {
          data: economies.map(region => ({
            borderWidth: 0,
            geometry: region.geometry

          })),
          enableMouseTracking: false,
          name: 'Economies',
          type: 'map',
          visible: false
        },
        // Using the function to create mapline series
        createMaplineSeries('Dashed Borders', dashedborders, 'Dash'),
        createMaplineSeries('Dotted Borders', dottedborders, 'Dot'),
        createMaplineSeries('Dash Dotted Borders', dashdottedborders, 'DashDot'),
        createMaplineSeries('Plain Borders', plainborders, 'Solid'),
      ],
      subtitle: {
        text: null,
      },
      tooltip: {
        enabled: true,
        headerFormat: '<span style="font-size: 15px;"><strong>{point.name}</strong></span><br /><br />',
        pointFormat: pointFormat(type),
        style: {
          color: '#000',
          fontSize: '13px'
        }
      },
      title: {
        text: null,
      }
    });
    return () => {
      if (ref.current) {
        ref.current.destroy(); // Cleanup on unmount
        ref.current = null;
      }
    };
  }, [ref]);

  useEffect(() => {
    const [topology, data] = props.values;
    createMap(data, props.type, topology);
  }, [createMap, props]);

  return (
    <div id="map_container" />
  );
});

export default ChartMap;

ChartMap.propTypes = {
  values: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])).isRequired,
  type: PropTypes.string.isRequired
};
