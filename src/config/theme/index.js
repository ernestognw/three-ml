import { generate } from '@ant-design/colors';
import media from './media';
import variables from './variables.json';

const theme = {
  media,
  ...variables,
  colors: {
    ...Object.keys(variables.colors).reduce((acc, color) => {
      acc[color] = variables.colors[color];
      acc[`${color}Palette`] = generate(variables.colors[color]);
      return acc;
    }, {}),
    background: {
      dark: '#001529',
      light: '#fff',
      grey: '#f0f2f5',
    },
  },
};

export default theme;
