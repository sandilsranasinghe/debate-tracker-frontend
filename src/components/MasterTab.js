import React, {useEffect, useState} from "react";
import {Button, Paper} from "@mui/material";
import StyledDataGrid from "../utils/styledDataGrid";
import {GridToolbar} from "@mui/x-data-grid";
import {saveAs} from "file-saver";

// Utility Functions

function exportToCSV(rows, columns, filename = "master_tab.csv") {
    const csvRows = [];

    // Extract column headers
    const headers = columns.map((col) => col.headerName);
    csvRows.push(headers.join(","));

    // Extract data rows
    rows.forEach((row) => {
        const values = columns.map((col) => {
            const value = row[col.field];
            if (Array.isArray(value)) {
                return value.join(" | "); // Format arrays as pipe-separated strings
            }
            return value ?? ""; // Default to empty string if value is null/undefined
        });
        csvRows.push(values.join(","));
    });

    // Create a Blob and trigger the download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
}


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
    const API_URL = `http://localhost:8080/api/v1/debater/speaks/all`;

    const fetchRankings = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const transformedRankings = data.map((debater) => {
                const scores = debater.tournamentRoundScores
                    ? debater.tournamentRoundScores.flatMap((tournament) =>
                        tournament.roundScores.map((round) => round.score)
                    )
                    : [];

                const avgScore = scores.length > 0 ? calcAverage(scores) : 0;
                const avgScoreWOOutliers =
                    scores.length > 0 ? calcAverage(removeOutliers(scores)) : 0;
                const roundsDebated = debater.tournamentRoundScores
                    ? debater.tournamentRoundScores.reduce(
                        (sum, tournament) => sum + tournament.numberOfRounds,
                        0
                    )
                    : 0;

                return {
                    ...debater,
                    scores,
                    avgScore,
                    avgScoreWOOutliers,
                    roundsDebated,
                    stdDev: scores.length > 0 ? calcStandardDeviation(scores) : 0,
                };
            }).filter((debater) => debater.roundsDebated > 0);

            console.log("Transformed Rankings:", transformedRankings); // Debugging log
            setRankings(transformedRankings);
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
    if (error) return <p style={{color: "red"}}>Error: {error}</p>;

    return (
        <Paper sx={{maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh"}}>

            <Button
                variant="contained"
                sx={{margin: 2}}
                onClick={() =>
                    exportToCSV(rankings, [
                        {field: "firstName", headerName: "First Name"},
                        {field: "lastName", headerName: "Last Name"},
                        {field: "scores", headerName: "Scores"},
                        {field: "avgScore", headerName: "Average Score"},
                        {field: "avgScoreWOOutliers", headerName: "Avg Score WO Outliers"},
                        {field: "roundsDebated", headerName: "Prelims Debated"},
                        {field: "stdDev", headerName: "Standard Deviation"},
                    ])
                }
                >
                Download CSV </Button>
            <StyledDataGrid
                rows={rankings.map((debater, index) => ({
                    ...debater,
                    id: debater.id || index + 1, // Use ID or index as a fallback
                    scores: debater.scores || [], // Fallback to empty array
                }))}

                columns={[
                    {field: "firstName", headerName: "First Name", width: 150, sortable: true},
                    {field: "lastName", headerName: "Last Name", width: 150, sortable: true},
                    {
                        field: "scores",
                        headerName: "Scores",
                        flex: 1,
                        sortable: false,
                    },

                    {
                        field: "avgScore",
                        headerName: "Average Score",
                        width: 100,
                        type: "number",
                        sortable: true,
                    },
                    {
                        field: "avgScoreWOOutliers",
                        headerName: "Avg Score WO Outliers",
                        width: 100,
                        type: "number",
                        sortable: true,
                    },
                    {
                        field: "roundsDebated",
                        headerName: "Prelims Debated",
                        width: 100,
                        type: "number",
                        sortable: true,
                    },
                    {
                        field: "stdDev",
                        headerName: "Standard Deviation",
                        width: 100,
                        type: "number",
                        sortable: true,
                    },
                ]}
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        wordBreak: 'break-word',  // Ensures the header text wraps
                        lineHeight: '1.5',        // Adjusts the height of the header row
                        minHeight: '60px',        // Sets a minimum height for the header row to accommodate wrapped text
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        whiteSpace: 'normal',     // Allows text to wrap inside header cells
                        overflow: 'visible',      // Ensures that content doesn't overflow out of the cell
                        textOverflow: 'unset',    // Prevents truncation of text
                        wordWrap: 'break-word',   // Allows word wrapping
                    },
                }}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </Paper>
    );
};

export default MasterTab;
