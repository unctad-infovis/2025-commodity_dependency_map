import React from 'react';

import { createRoot } from 'react-dom/client';

import CommodityDependencyMap from './jsx/CommodityDependencyMap.jsx';
import StateOfCommodityDependency from './jsx/StateOfCommodityDependency.jsx';

const containerCommodityDependencyMap = document.getElementById('app-root-2025-commodity_dependency_map');
if (containerCommodityDependencyMap) {
  const rootCommodityDependencyMap = createRoot(containerCommodityDependencyMap);
  rootCommodityDependencyMap.render(<CommodityDependencyMap />);
}

const containerStateOfCommodityDependency = document.getElementById('app-root-2025-commodity_dependency_map_2');
if (containerStateOfCommodityDependency) {
  const rootStateOfCommodityDependency = createRoot(containerStateOfCommodityDependency);
  rootStateOfCommodityDependency.render(<StateOfCommodityDependency />);
}
