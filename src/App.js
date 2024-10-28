import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu.js'; // Ensure this path is correct
import Debaters from './components/Debaters.js';
import SpeakerGraphs from "./components/SpeakerGraphs.js";
import MasterTab from "./components/MasterTab.js";
import Institutions from "./components/Institutions.js";
import JudgeRounds from "./components/JudgeRounds.js";
import Judges from "./components/Judges.js";
import JudgeSpeaks from "./components/JudgeSpeaks.js";


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
                    <Route path="/judge-rounds" element={<JudgeRounds />} />
                    <Route path="/judge-speaks" element={<JudgeSpeaks />} />
                    <Route path="/judge" element={<Judges />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
