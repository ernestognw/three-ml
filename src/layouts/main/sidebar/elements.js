import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider: DefaultSider } = Layout;

const Sider = styled(DefaultSider)`
  overflow-y: scroll;
  width: 25% !important;
  max-width: 25% !important;
  flex-basis: 25% !important;
  padding: 10px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export { Sider };
