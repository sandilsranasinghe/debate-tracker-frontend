import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {theme} from './theme.js';

import Menu from './components/Menu.js';
import Debaters from './components/Debaters.js';
import SpeakerGraphs from "./components/SpeakerGraphs.js";
import MasterTab from "./components/MasterTab.js";
import Institutions from "./components/Institutions.js";
import Judges from "./components/Judges.js";
import JudgeSpeaks from "./components/JudgeSpeaks.js";


const App = () => {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Menu />
                <Routes>
                    <Route path="/debaters" element={<Debaters />} />
                    <Route path="/master-tab" element={<MasterTab/>} />
                    <Route path="/institutions" element={<Institutions />} />
                    <Route path="/graphs" element={<SpeakerGraphs />} />
                    <Route path="/judge-speaks" element={<JudgeSpeaks />} />
                    <Route path="/judge" element={<Judges />} />
                </Routes>
            </ThemeProvider>
        </Router>
    );
};

export default App;
