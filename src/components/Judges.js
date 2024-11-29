import React, { useState, useEffect } from "react";
import StyledDataGrid from "../utils/styledDataGrid";
import Paper from "@mui/material/Paper";

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
    <Paper sx={{ maxWidth: "94vw", marginInline: "auto", marginBlock: "4vh" }}>
      <StyledDataGrid
        rows={judges.map((judge, index) => ({ id: index + 1, ...judge }))}
        columns={[
          {
            field: "fname",
            headerName: "First Name",
            flex: 0.5,
            sortable: true,
          },
          {
            field: "lname",
            headerName: "Last Name",
            flex: 0.5,
            sortable: true,
          },
        ]}
      />
    </Paper>
  );
};

export default JudgeRounds;
