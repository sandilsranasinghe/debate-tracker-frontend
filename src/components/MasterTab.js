import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

// Utility Functions
const removeOutliers = (scores) => {
  const q1 = scores[Math.floor(scores.length / 4)];
  const q3 = scores[Math.ceil(scores.length * (3 / 4)) - 1];
  const iqr = q3 - q1;
  return scores.filter(
    (score) => score >= q1 - 1.5 * iqr && score <= q3 + 1.5 * iqr
  );
};

const calcAverage = (scores) =>
  (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

const calcStandardDeviation = (scores) => {
  const avg = calcAverage(scores);
  return Math.sqrt(
    scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length
  ).toFixed(2);
};

const MasterTab = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const API_URL = `http://localhost:8080/api/v1/ballot/debater/scores-all`;

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

  //   const sortedRankings = React.useMemo(() => {
  //     let sortableRankings = [...rankings];
  //     if (sortConfig.key) {
  //       sortableRankings.sort((a, b) => {
  //         let aValue, bValue;
  //         if (
  //           sortConfig.key === "avgScoreWOOutliers" ||
  //           sortConfig.key === "stdDev"
  //         ) {
  //           const aScores = a.scores.slice().sort((x, y) => x - y);
  //           const bScores = b.scores.slice().sort((x, y) => x - y);

  //           const aFiltered = removeOutliers(aScores);
  //           const bFiltered = removeOutliers(bScores);

  //           aValue =
  //             sortConfig.key === "avgScoreWOOutliers"
  //               ? calcAverage(aFiltered)
  //               : calcStandardDeviation(aFiltered);
  //           bValue =
  //             sortConfig.key === "avgScoreWOOutliers"
  //               ? calcAverage(bFiltered)
  //               : calcStandardDeviation(bFiltered);
  //         } else {
  //           aValue = a[sortConfig.key];
  //           bValue = b[sortConfig.key];
  //         }

  //         if (aValue < bValue)
  //           return sortConfig.direction === "ascending" ? -1 : 1;
  //         if (aValue > bValue)
  //           return sortConfig.direction === "ascending" ? 1 : -1;
  //         return 0;
  //       });
  //     }
  //     return sortableRankings;
  //   }, [rankings, sortConfig]);

  //   const requestSort = (key) => {
  //     let direction = "ascending";
  //     if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //       direction = "descending";
  //     }
  //     setSortConfig({ key, direction });
  //   };
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded rows

  if (loading) return <p>Loading rankings...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  const toggleExpand = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // return (
  //     <div className="rankings">
  //         <h1>Debater Rankings</h1>
  //         <table>
  //             <thead>
  //             <tr>
  //                 <th onClick={() => requestSort('firstName')}>First Name</th>
  //                 <th onClick={() => requestSort('lastName')}>Last Name</th>
  //                 <th>Scores</th>
  //                 <th onClick={() => requestSort('avgScoreWOOutliers')}>Average Score WO Outliers</th>
  //                 <th onClick={() => requestSort('avgScore')}>Average Score</th>
  //                 <th onClick={() => requestSort('roundsDebated')}>Rounds Debated</th>
  //                 <th onClick={() => requestSort('stdDev')}>Standard Deviation</th>
  //             </tr>
  //             </thead>
  //             <tbody>
  //             {sortedRankings.map((debater, index) => {
  //                 const scores = debater.scores.sort((a, b) => a - b);
  //                 const filteredScores = removeOutliers(scores);
  //                 const avgScoreWOOutliers = calcAverage(filteredScores);
  //                 const stdDev = calcStandardDeviation(filteredScores);

  //                 return (
  //                     <tr key={index}>
  //                         <td>{debater.firstName}</td>
  //                         <td>{debater.lastName}</td>
  //                         {/*<td>{filteredScores.join(', ')}</td>*/}
  //                         <td>
  //                             {expandedRows[index]
  //                                 ? filteredScores.join(', ') // Show full list if expanded
  //                                 : `${filteredScores.slice(0, 3).join(', ')}...`} {/* Truncated view */}
  //                             <button className="truncate" onClick={() => toggleExpand(index)}>
  //                                 {expandedRows[index] ? 'Show Less' : 'Show More'}
  //                             </button>
  //                         </td>
  //                         <td>{avgScoreWOOutliers}</td>
  //                         <td>{debater.avgScore.toFixed(2)}</td>
  //                         <td>{debater.roundsDebated}</td>
  //                         <td>{stdDev}</td>
  //                     </tr>
  //                 );
  //             })}
  //             </tbody>
  //         </table>
  //     </div>
  // );

  return (
    <Paper sx={{ maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh" }}>
      <StyledDataGrid
        rows={rankings.map((debater, index) => {
          return { ...debater, id: index + 1 };
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
