import { useContext } from 'react';
import VisualizationProvider, { VisualizationContext } from './provider';

const useVisualization = () => useContext(VisualizationContext);

export { useVisualization, VisualizationProvider };
