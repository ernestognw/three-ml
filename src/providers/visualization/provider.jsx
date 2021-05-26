import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const VisualizationContext = createContext({});

const VisualizationProvider = ({ children }) => {
  return <VisualizationContext.Provider value={{}}>{children}</VisualizationContext.Provider>;
};

VisualizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { VisualizationContext };
export default VisualizationProvider;
