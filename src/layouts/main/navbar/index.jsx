import React from 'react';
import { PageHeader } from 'antd';
import { NavbarContainer } from './elements';

const NavBar = () => {
  return (
    <NavbarContainer>
      <PageHeader
        backIcon={false}
        style={{ marginRight: 'auto', padding: '0px 20px' }}
        title="ThreeML"
      />
    </NavbarContainer>
  );
};

export default NavBar;
