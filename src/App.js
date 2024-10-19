import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu.js'; // Ensure this path is correct
import DebaterList from './components/DebaterList.js';
import Rankings from "./components/Rankings.js";
import SpeakerGraphs from "./components/SpeakerGraphs.js";
import MasterTab from "./components/MasterTab.js";


const App = () => {
    return (
        <Router>
            <div className="app">
                <Menu />
                <Routes>
                    <Route path="/debaters" element={<DebaterList />} />
                    <Route path="/rankings" element={<Rankings />} />
                    <Route path="/master-tab" element={<MasterTab/>} />
                    {/*<Route path="/rankings" element={<RankingsComponent />} />*/}
                    <Route path="/graphs" element={<SpeakerGraphs />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
