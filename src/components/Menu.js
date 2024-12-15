import React from "react";
import {Link} from "react-router-dom";

import {styled} from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NavButton = styled(Button)(() => ({
  marginRight: "10px",
  fontWeight: "bolder",
  backgroundImage:
      "linear-gradient(45deg, transparent 40%, #ffffff11, transparent 60%)",
  backgroundSize: "300%",
  backgroundPosition: "0% 0%",
  transition: "background-position 1s",
  "&:hover": {
    backgroundPosition: "100% 100%",
  },
}));

const Menu = () => {
  return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <img src="/main-logo-dark.svg" alt="DC Logo" style={{ width: '90px', height: 'auto' }}/>
          </Box>

          <Box sx={{flexGrow: 0}}>
            <NavButton component={Link} to="/debaters">
              Debaters
            </NavButton>
            <NavButton component={Link} to="/master-tab">
              Master Tab
            </NavButton>
            <NavButton component={Link} to="/graphs">
              Graphs
            </NavButton>
            <NavButton component={Link} to="/institutions">
              Institutions
            </NavButton>
            <NavButton component={Link} to="/judge-rounds">
              Judge Rounds
            </NavButton>
            <NavButton component={Link} to="/judge-speaks">
              Judge Speaks
            </NavButton>
            <NavButton component={Link} to="/judge">
              Judges
            </NavButton>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default Menu;
