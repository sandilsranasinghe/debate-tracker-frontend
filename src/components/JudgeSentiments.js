import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";
import {GridToolbar} from "@mui/x-data-grid";


const JudgeSentiments = () => {
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = `http://localhost:8080/api/v1/statistics/sentiment?allowed-deviation=0.5`;

    const fetchJudges = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const processedJudges = data.map((entity) => {
                const totalSpeeches = entity.speechesJudged;

                return {
                    id: entity.judgeId, // Use judgeId as row ID for unique identification
                    firstName: entity.firstName,
                    lastName: entity.lastName,
                    speechesJudged: totalSpeeches,
                    leniencyCount: entity.leniencyCount,
                    harshnessCount: entity.harshnessCount,
                    neutralCount: entity.neutralCount,
                    leniency: totalSpeeches > 0 ? (entity.leniency / entity.leniencyCount).toFixed(2) : NaN,
                    harshness: totalSpeeches > 0 ? (entity.harshness / entity.harshnessCount).toFixed(2) : NaN,
                    overallSentiment: entity.overallSentiment,
                    overallDeviation: totalSpeeches > 0 ? ((entity.leniency - entity.harshness) / (entity.leniencyCount + entity.harshnessCount)).toFixed(2) : NaN,
                    leniencyPercentage: totalSpeeches > 0 ? ((entity.leniencyCount / totalSpeeches) * 100).toFixed(2) : NaN,
                    harshnessPercentage: totalSpeeches > 0 ? ((entity.harshnessCount / totalSpeeches) * 100).toFixed(2) : NaN,
                    neutralPercentage: totalSpeeches > 0 ? ((entity.neutralCount / totalSpeeches) * 100).toFixed(2) : NaN,
                };
            }).filter((judge) => judge.speechesJudged > 0);

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
                rows={judges}
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
                        width: 180,
                        sortable: true,
                    },
                    {
                        field: "speechesJudged",
                        headerName: "Speeches Considered",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "leniency",
                        headerName: "Average",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "leniencyPercentage",
                        headerName: "Frequency (%)",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "harshness",
                        headerName: "Average",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "harshnessPercentage",
                        headerName: "Frequency (%)",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "neutralPercentage",
                        headerName: " Neutral Frequency (%)",
                        width: 150,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "overallSentiment",
                        headerName: "Overall Sentiment",
                        width: 100,
                        sortable: true,
                        type: "number",
                    },
                    {
                        field: "overallDeviation",
                        headerName: "Overall Deviation",
                        width: 105,
                        sortable: true,
                        type: "number",
                    },
                ]}

                columnGroupingModel={[
                    {
                        groupId: 'Leniency',
                        children: [{field: 'leniency'}, {field: 'leniencyPercentage'}],
                    },
                    {
                        groupId: 'Harshness',
                        children: [{field: 'harshness'}, {field: 'harshnessPercentage'}],
                    },
                ]}


                sx={{
                    "& .MuiDataGrid-columnHeaders": {
                        wordBreak: "break-word", // Ensures the header text wraps
                        lineHeight: "1.5", // Adjusts the height of the header row
                        minHeight: "60px", // Sets a minimum height for the header row to accommodate wrapped text
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        whiteSpace: "normal", // Allows text to wrap inside header cells
                        overflow: "visible", // Ensures that content doesn't overflow out of the cell
                        textOverflow: "unset", // Prevents truncation of text
                        wordWrap: "break-word", // Allows word wrapping
                    },
                }}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </Paper>
    );
};

export default JudgeSentiments;
