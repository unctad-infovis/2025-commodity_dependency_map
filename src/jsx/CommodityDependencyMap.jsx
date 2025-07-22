import React, { useState, useEffect, useRef } from 'react';
import '../styles/styles.less';

// Load helpers.
import ChartMap from './modules/ChartMap.jsx';
import Dropdown from './modules/Dropdown.jsx';

function App() {
  const [curValue, setCurValue] = useState('all');
  const [data, setData] = useState(false);

  const appRef = useRef(null);

  const fetchExternalData = () => {
    const dataPath = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2025-commodity_dependency_map/' : (window.location.href.includes('localhost:80')) ? './' : 'https://unctad-infovis.github.io/2025-commodity_dependency_map/'}assets/data/`;

    const topology_file = 'worldmap-economies-54030.topo.json';
    const data_file = 'data.json';
    let values;
    try {
      values = Promise.all([
        fetch(dataPath + topology_file),
        fetch(dataPath + data_file),
      ]).then(results => Promise.all(results.map(result => result.json())));
    } catch (error) {
      console.error(error);
    }
    return values;
  };

  useEffect(() => {
    fetchExternalData().then((result) => setData(result));
  }, []);

  const changeData = (element, value) => {
    appRef.current.querySelectorAll('.controls_container button').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    appRef.current.querySelector('h4 span').textContent = element.dataset.commodityLabel;
    setCurValue(value);
  };

  return (
    <div className="app" ref={appRef}>
      {data !== false && <Dropdown values={data[1]} />}
      <div className="title_container">
        <img src="https://static.dwcdn.net/custom/themes/unctad-2024-rebrand/Blue%20arrow.svg" className="logo" alt="UN Trade and Development logo" />
        <div className="title">
          <h3>World commodity export dependence</h3>
          <h4>
            <span>All commodities, per country, percentage</span>
            , 2021–2023
          </h4>
        </div>
      </div>
      <div className="controls_container">
        <button type="button" className="selected" onClick={(event) => changeData(event.currentTarget, 'all')} data-arial-label="Select all commodities" data-commodity-label="All commodities, per country, percentage">
          All commodities
        </button>
        <button type="button" onClick={(event) => changeData(event.currentTarget, 'agriculture')} data-arial-label="Select agriculture" data-commodity-label="Agriculture exports, per country">
          Agriculture
        </button>
        <button type="button" onClick={(event) => changeData(event.currentTarget, 'energy')} data-arial-label="Select energy" data-commodity-label="Energy exports, per country">
          Energy
        </button>
        <button type="button" onClick={(event) => changeData(event.currentTarget, 'mining')} data-arial-label="Select mining" data-commodity-label="Minerals, ores and metals export, per country">
          Mining
        </button>
      </div>
      {data !== false && <ChartMap values={data} type_data={curValue} />}
    </div>
  );
}

export default App;
