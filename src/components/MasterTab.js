import React, { useState, useEffect } from 'react';
import './css/Rankings.css';

// Utility Functions
const removeOutliers = (scores) => {
    // Handle edge cases: empty or small arrays
    if (scores.length < 4) return scores;

    // Sort the scores array (non-destructive)
    const sortedScores = scores.slice().sort((a, b) => a - b);

    // Calculate Q1 and Q3
    const q1 = sortedScores[Math.floor(sortedScores.length / 4)];
    const q3 = sortedScores[Math.ceil(sortedScores.length * (3 / 4)) - 1];

    // Calculate interquartile range (IQR)
    const iqr = q3 - q1;

    // Filter scores within the IQR bounds
    return sortedScores.filter(score => score >= (q1 - 1.5 * iqr) && score <= (q3 + 1.5 * iqr));
};


const calcAverage = (scores) => {
    if (scores.length === 0) return 'NaN'; // Return 'NaN' as a string to avoid UI breaking
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
};

const calcStandardDeviation = (scores) => {
    if (scores.length === 0) return 'NaN';
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length).toFixed(2);
};


const MasterTab = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [expandedRows, setExpandedRows] = useState({});

    const API_URL = `http://localhost:8080/api/v1/debater/speaks/all`;

    const fetchRankings = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Transform data to flatten tournament scores and calculate values
            const transformedData = data.map((debater) => {
                const allScores = debater.tournamentRoundScores?.flatMap((tournament) =>
                    tournament.roundScores?.map((round) => round.score) || []
                ) || [];

                const filteredScores = removeOutliers(allScores);
                const avgScore = allScores.length > 0 ? calcAverage(allScores) : 'NaN';
                const stdDev = filteredScores.length > 0 ? calcStandardDeviation(filteredScores) : 'NaN';
                const roundsDebated = debater.tournamentRoundScores?.reduce(
                    (sum, tournament) => sum + (tournament.numberOfRounds || 0),
                    0
                ) || 0;
                if(debater.firstName === 'Seniya') {
                    console.log(`First Name: ${debater.firstName}`);
                    console.log(`Rounds Debated: ${roundsDebated}`);
                    console.log(`All Scores: ${allScores}`);
                    console.log(`Filtered Scores: ${filteredScores}`);
                    console.log(`Average Score: ${avgScore}`);
                    console.log(`Standard Deviation: ${stdDev}`);
                }

                return {
                    ...debater,
                    allScores,
                    filteredScores,
                    avgScore,
                    stdDev,
                    roundsDebated,
                };
            });


            setRankings(transformedData.filter((debater) => debater.roundsDebated > 0));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    const sortedRankings = React.useMemo(() => {
        let sortableRankings = [...rankings];
        if (sortConfig.key) {
            sortableRankings.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'stdDev') {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);

                    // Handle NaN explicitly
                    if (isNaN(aValue)) return sortConfig.direction === 'ascending' ? 1 : -1;
                    if (isNaN(bValue)) return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableRankings;
    }, [rankings, sortConfig]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const toggleExpand = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (loading) return <p>Loading rankings...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="rankings">
            <h1>Debater Rankings</h1>
            <table>
                <thead>
                <tr>
                    <th onClick={() => requestSort('firstName')}>First Name</th>
                    <th onClick={() => requestSort('lastName')}>Last Name</th>
                    <th>Scores</th>
                    <th onClick={() => requestSort('avgScore')}>Average Score</th>
                    <th onClick={() => requestSort('roundsDebated')}>Rounds Debated</th>
                    <th onClick={() => requestSort('stdDev')}>Standard Deviation</th>
                </tr>
                </thead>
                <tbody>
                {sortedRankings.map((debater, index) => (
                    <tr key={index}>
                        <td>{debater.firstName}</td>
                        <td>{debater.lastName}</td>
                        <td>
                            {expandedRows[index]
                                ? debater.filteredScores?.join(', ') || 'No scores available'
                                : `${debater.filteredScores?.slice(0, 3).join(', ') || 'No scores'}...`}
                            <button className="truncate" onClick={() => toggleExpand(index)}>
                                {expandedRows[index] ? 'Show Less' : 'Show More'}
                            </button>
                        </td>
                        <td>{debater.avgScore}</td>
                        <td>{debater.roundsDebated}</td>
                        <td>{debater.stdDev}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MasterTab;
