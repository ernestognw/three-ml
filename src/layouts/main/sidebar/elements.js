import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider: DefaultSider } = Layout;

const Sider = styled(DefaultSider)`
  width: 20% !important;
  max-width: 20% !important;
  flex-basis: 20% !important;
  padding: 10px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export { Sider };
