import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

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
  const API_URL = `http://localhost:8080/api/v1/debater/speaks/all`;

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
  if (error) return <p style={{color: "red"}}>Error: {error}</p>;
  return (
      <Paper sx={{maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh"}}>
        <StyledDataGrid
            rows={rankings.map((debater, index) => {
              return {...debater, id: index + 1};
            })}
            columns={[
              {
                field: "firstName",
                headerName: "First Name",
                width: 150,
                sortable: true,
              },
              {
                field: "lastName",
                headerName: "Last Name",
                width: 150,
                sortable: true,
              },
              {
                field: "scores",
                headerName: "Scores",
                flex: 1,
                sortable: false,
              },
              {
                field: "avgScore",
                headerName: "Average Score",
                width: 150,
                sortable: true,
                valueFormatter: (value) => value.toFixed(2),
              },
              {
                field: "avgScoreWOOutliers",
                headerName: "Avg Score WO Outliers",
                width: 200,
                sortable: true,
                valueGetter: (value, row) => {
                  return calcAverage(removeOutliers(row.scores.sort()));
                },
              },
              {
                field: "roundsDebated",
                headerName: "Rounds Debated",
                width: 150,
                sortable: true,
              },
              {
                field: "stdDev",
                headerName: "Standard Deviation",
                width: 150,
                sortable: true,
                valueGetter: (value, row) => {
                  return calcStandardDeviation(row.scores);
                },
              },
            ]}
        />
      </Paper>
  );
};

export default MasterTab;
