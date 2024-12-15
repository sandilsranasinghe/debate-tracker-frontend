import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

// Utility Functions
const calcAverage = (scores) =>
    (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

const calcStandardDeviation = (scores, avgScore) =>
    Math.sqrt(
        scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length
    ).toFixed(2);

const JudgeSpeaks = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://localhost:8080/api/v1/ballot/judge/scores-all`;

  const fetchJudges = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const processedJudges = data.map((judge) => {
        const scores = judge.scores;
        const avgScore = calcAverage(scores);
        const stdDev = calcStandardDeviation(scores, avgScore);

        return {
          ...judge,
          avgScore: parseFloat(avgScore),
          stdDev: parseFloat(stdDev),
          count: scores.length,
        };
      });

      setJudges(processedJudges);
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
      <Paper sx={{maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh"}}>
        <StyledDataGrid
            rows={judges.map((judge, index) => {
              return {...judge, id: index + 1};
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
                headerName: "Scores Given",
                flex: 1,
                sortable: false,
              },
              {
                field: "avgScore",
                headerName: "Average Score",
                width: 150,
                sortable: true,
                type: "number",
                valueFormatter: (value) => value.toFixed(2),
              },
              {
                field: "stdDev",
                headerName: "Standard Deviation",
                width: 150,
                sortable: true,
                type: "number",
                valueFormatter: (value) => value.toFixed(2),
              },
              {
                field: "count",
                headerName: "Count",
                width: 150,
                sortable: true,
                valueGetter: (value) => Math.ceil(value / 6),
                type: "number",
              },
            ]}
        />
      </Paper>
  );
};

export default JudgeSpeaks;
