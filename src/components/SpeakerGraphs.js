import React, { useState } from 'react';
import { LineChart } from '@mui/x-charts';
import './css/SpeakerGraphs.css'; // Import the CSS file

const SpeakerGraphs = () => {
    const [scores, setScores] = useState([]);
    const [speakerName, setSpeakerName] = useState('');
    const [loading, setLoading] = useState(false);

    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/ballot/debater`;
    const API_URL = `http://localhost:8080/api/v1/ballot/debater-scores`; // Adjust API URL as needed

    const fetchScores = async (fname,lname) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?fname=${fname}&lname=${lname}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.scores) {
                setScores(data.scores); // Assuming the API returns a list of scores for that speaker
            }
        } catch (err) {
            console.error("Error fetching scores:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (speakerName.trim()) {
            fetchScores(speakerName.split(" ")[0],speakerName.split(" ")[1]);
        } else {
            console.error("Speaker name cannot be empty");
        }
    };

    return (
        <div className="graphs">
            <h1>Speaker Performance</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter speaker's name"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                />
                <button type="submit">Fetch Scores</button>
            </form>

            {loading && <p>Loading scores...</p>}

            {scores.length > 0 && (
                <div className="chart-container">
                    <LineChart
                        xAxis={[{ data: Array.from({ length: scores.length }, (_, i) => i + 1) }]} // X-axis is round numbers
                        series={[
                            {
                                data: scores, // Y-axis is the scores fetched from the API
                            },
                        ]}
                        width={500}
                        height={300}
                    />
                </div>
            )}
        </div>
    );
};

export default SpeakerGraphs;