import styled from 'styled-components';
import { Layout } from 'antd';

const { Header } = Layout;

const NavbarContainer = styled(Header)`
  padding: 0px !important;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.background.dark};

  .ant-page-header-heading-title {
    color: ${(props) => props.theme.colors.background.grey};
  }
`;

export { NavbarContainer };
