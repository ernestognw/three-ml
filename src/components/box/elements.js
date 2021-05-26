import styled from 'styled-components';
import {
  compose,
  space,
  layout,
  color,
  typography,
  flexbox,
  grid,
  border,
  background,
  position,
  shadow,
} from 'styled-system';

const SystemBox = styled.div`
  ${compose(space, layout, color, typography, flexbox, grid, border, background, position, shadow)}
  cursor: ${({ cursor }) => cursor}
`;

export { SystemBox };
