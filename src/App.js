import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu.js'; // Ensure this path is correct
import Debaters from './components/Debaters.js';
import SpeakerGraphs from "./components/SpeakerGraphs.js";
import MasterTab from "./components/MasterTab.js";
import Institutions from "./components/Institutions.js";


const App = () => {
    return (
        <Router>
            <div className="app">
                <Menu />
                <Routes>
                    <Route path="/debaters" element={<Debaters />} />
                    <Route path="/master-tab" element={<MasterTab/>} />
                    <Route path="/institutions" element={<Institutions />} />
                    <Route path="/graphs" element={<SpeakerGraphs />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
