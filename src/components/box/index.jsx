import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import propTypes from '@styled-system/prop-types';
import { SystemBox } from './elements';

const Box = forwardRef(({ cursor, ...props }, ref) => (
  <SystemBox ref={ref} cursor={cursor} {...props} />
));

Box.defaultProps = {
  cursor: 'inherit',
};

Box.propTypes = {
  ...propTypes.space,
  ...propTypes.layout,
  ...propTypes.color,
  ...propTypes.typography,
  ...propTypes.flexbox,
  ...propTypes.grid,
  ...propTypes.border,
  ...propTypes.background,
  ...propTypes.position,
  ...propTypes.shadow,
  cursor: PropTypes.oneOf(['pointer', 'inherit']),
};

export default Box;
