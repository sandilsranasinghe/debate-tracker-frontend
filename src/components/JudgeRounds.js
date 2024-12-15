import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

const JudgeRounds = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `http://localhost:8080/api/v1/judge/stats/rounds`;

  const fetchJudges = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setJudges(data);
      console.log("Fetched Judges:", data);
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
            rows={judges}
            columns={[
              {
                field: "firstName",
                headerName: "First Name",
                flex: 0.5,
                sortable: true,
              },
              {
                field: "lastName",
                headerName: "Last Name",
                flex: 0.5,
                sortable: true,
              },
              {
                field: "roundsJudged",
                headerName: "Rounds Judged",
                width: 250,
                sortable: true,
                type: "number",
              },
            ]}
            getRowId={(row) => row.judgeId}
        />
      </Paper>
  );
};

export default JudgeRounds;
