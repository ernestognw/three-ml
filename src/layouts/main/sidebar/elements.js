import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider: DefaultSider } = Layout;

const Sider = styled(DefaultSider)`
  overflow-y: scroll;
  width: 20% !important;
  max-width: 20% !important;
  flex-basis: 20% !important;
  background-color: #fff;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export { Sider };
