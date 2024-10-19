import React, { useState, useEffect } from 'react';
import './css/Rankings.css'; // Import the CSS file

const MasterTab = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/ballot/debater-scores-all`;
    const API_URL = `http://localhost:8080/api/v1/ballot/debater-scores-all`;


    const fetchRankings = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setRankings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    if (loading) return <p>Loading rankings...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="rankings">
            <h1>Debater Rankings</h1>
            <table>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Scores</th>
                    <th>Average Score WO Outliers</th>
                    <th>Average Score</th>
                    <th>Rounds Debated</th>
                    <th>Standard Deviation</th>
                </tr>
                </thead>
                <tbody>
                {rankings.map((debater, index) => {
                    const scores = debater.scores.sort((a, b) => a - b); // Sort scores
                    const q1 = scores[Math.floor((scores.length / 4))];
                    const q3 = scores[Math.ceil((scores.length * (3 / 4))) - 1];
                    const iqr = q3 - q1;

                    const filteredScores = scores.filter(score =>
                        score >= (q1 - 1.5 * iqr) && score <= (q3 + 1.5 * iqr)
                    );

                    const avgScore = (filteredScores.reduce((a, b) => a + b, 0) / filteredScores.length).toFixed(2);
                    const stddev = (Math.sqrt(filteredScores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / filteredScores.length)).toFixed(2);

                    return (
                        <tr key={index}>
                            <td>{debater.firstName}</td>
                            <td>{debater.lastName}</td>
                            <td>{filteredScores.join(', ')}</td>
                            <td>{avgScore}</td>
                            <td>{(debater.avgScore).toFixed(2)}</td>
                            <td>{debater.roundsDebated}</td>
                            <td>{stddev}</td>
                        </tr>
                    );
                })}

                </tbody>
            </table>
        </div>
    );
};

export default MasterTab;
