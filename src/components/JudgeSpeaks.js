import React, { useState, useEffect } from "react";
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
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

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

  // const handleSort = (column) => {
  //   const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
  //   setSortColumn(column);
  //   setSortOrder(order);

  //   const sortedJudges = [...judges].sort((a, b) => {
  //     if (a[column] < b[column]) return order === "asc" ? -1 : 1;
  //     if (a[column] > b[column]) return order === "asc" ? 1 : -1;
  //     return 0;
  //   });

  //   setJudges(sortedJudges);
  // };

  // const toggleExpand = (index) => {
  //   setExpandedRows((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  if (loading) return <p>Loading judges...</p>;

  // return (
  //     <div className="rankings">
  //         <h1>Judge Tournament Rounds</h1>
  //         <table>
  //             <thead>
  //             <tr>
  //                 <th onClick={() => handleSort('firstName')}>First Name</th>
  //                 <th onClick={() => handleSort('lastName')}>Last Name</th>
  //                 <th>Scores Given</th>
  //                 <th onClick={() => handleSort('avgScore')}>Average Score</th>
  //                 <th onClick={() => handleSort('stdDev')}>Standard Deviation</th>
  //                 <th onClick={() => handleSort('count')}>Count</th>
  //             </tr>
  //             </thead>
  //             <tbody>
  //             {judges.filter(judge => judge.count > 10).map((judge, index) => (
  //                 <tr key={index}>
  //                     <td>{judge.firstName}</td>
  //                     <td>{judge.lastName}</td>
  //                     <td>
  //                         {expandedRows[index]
  //                             ? judge.scores.join(', ') // Show full list if expanded
  //                             : `${judge.scores.slice(0, 3).join(', ')}...`} {/* Truncated view */}
  //                         <button className="truncate" onClick={() => toggleExpand(index)}>
  //                             {expandedRows[index] ? 'Show Less' : 'Show More'}
  //                         </button>
  //                     </td>
  //                     <td>{judge.avgScore.toFixed(2)}</td>
  //                     <td>{judge.stdDev.toFixed(2)}</td>
  //                     <td>{Math.ceil(judge.count/6)}</td>
  //                 </tr>
  //             ))}
  //             </tbody>
  //         </table>
  //     </div>
  // );

  return (
    <Paper sx={{ maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh" }}>
      <StyledDataGrid
        rows={judges.map((judge, index) => {
          return { ...judge, id: index + 1 };
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
