import React, { useState, useEffect } from 'react';
import './css/JudgeRounds.css';

const JudgeRounds = () => {
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const API_URL = `http://localhost:8080/api/v1/judge/stats/rounds`;

    const fetchJudges = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setJudges(data);
            console.log('Fetched Judges:', data);
        } catch (err) {
            console.error("Error fetching judges:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJudges();
    }, []);

    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...judges].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setJudges(sortedData);
    };

    if (loading) return <p>Loading judges...</p>;

    return (
        <div className="rankings">
            <h1>Judge Stats</h1>
            <table>
                <thead>
                <tr>
                    <th onClick={() => sortData('firstName')}>First Name</th>
                    <th onClick={() => sortData('lastName')}>Last Name</th>
                    <th onClick={() => sortData('roundsJudged')}>Rounds Judged</th>
                </tr>
                </thead>
                <tbody>
                {judges.map((judge) => (
                    <tr key={judge.judgeId}>
                        <td>{judge.firstName}</td>
                        <td>{judge.lastName}</td>
                        <td>{judge.roundsJudged}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JudgeRounds;
