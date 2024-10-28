import React, { useState, useEffect } from 'react';
import './css/Judges.css'; // Import the CSS file

const JudgeRounds = () => {
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = `http://localhost:8080/api/v1/judge`;

    const fetchJudges = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setJudges(data);
        } catch (err) {
            console.error("Error fetching judges:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJudges();
    }, []);

    if (loading) return <p>Loading judges...</p>;

    return (
        <div className="rankings">
            <h1>Judge Tournament Rounds</h1>
            <table>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                {judges.map((judge, index) => (
                    <tr key={index}>
                        <td>{judge.lname}</td>
                        <td>{judge.fname}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JudgeRounds;
