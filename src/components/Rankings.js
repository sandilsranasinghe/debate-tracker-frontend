import React, { useState, useEffect } from 'react';
import './css/Rankings.css'; // Import the CSS file

const Rankings = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/ballot/debater-tournament-scores`;
    const API_URL = `http://localhost:8080/api/v1/ballot/debater-tournament-scores`;


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
                    <th>Tournament</th>
                    <th>Scores</th>
                    <th>Average Score</th>
                    <th>Team Name</th>
                </tr>
                </thead>
                <tbody>
                {rankings.map((debater, index) => (
                    <tr key={index}>
                        <td>{debater.firstName}</td>
                        <td>{debater.lastName}</td>
                        <td>{debater.tournamentShortName}</td>
                        <td>{debater.scores.join(', ')}</td>
                        <td>
                            {(
                                debater.scores.reduce((a, b) => a + b, 0) /
                                debater.scores.length
                            ).toFixed(2)}
                        </td>
                        <td>{debater.teamName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Rankings;
