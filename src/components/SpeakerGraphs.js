import React, {useEffect, useState} from "react";
import {LineChart} from "@mui/x-charts";

const SpeakerGraphs = () => {
    const [allDebaters, setAllDebaters] = useState([]); // Stores all debaters for autofill
    const [filteredDebaters, setFilteredDebaters] = useState([]); // Stores filtered debaters for search suggestions
    const [selectedDebaterId, setSelectedDebaterId] = useState(null);
    const [scores, setScores] = useState([]); // Stores the fetched scores
    const [tournamentDates, setTournamentDates] = useState([]); // Stores the dates for x-axis
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search input value

    const DEBATERS_API_URL = `http://localhost:8080/api/v1/debater`;
    const SCORES_API_URL = `http://localhost:8080/api/v1/debater/speaks/`; // Use ID to fetch data

    // Fetch all debaters on component mount
    useEffect(() => {
        const fetchDebaters = async () => {
            try {
                const response = await fetch(DEBATERS_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAllDebaters(data);
            } catch (err) {
                console.error("Error fetching debaters:", err);
            }
        };
        fetchDebaters();
    }, []);

    // Filter debaters based on search query
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = allDebaters.filter((debater) =>
                `${debater.firstName} ${debater.lastName}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
            setFilteredDebaters(filtered);
        } else {
            setFilteredDebaters([]);
            setSelectedDebaterId(null); // Clear the selected ID when the search is cleared
        }
    }, [searchQuery, allDebaters]);

    // Fetch scores for the selected debater
    const fetchScores = async (debaterId) => {
        setLoading(true);
        try {
            const response = await fetch(`${SCORES_API_URL}${debaterId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const scoresData = [];
            const datesData = [];

            data.tournamentRoundScores.forEach((tournament) => {
                tournament.roundScores.forEach((round) => {
                    scoresData.push(round.score);
                    datesData.push(new Date(tournament.date)); // Parse tournament date
                });
            });

            setTournamentDates(datesData);
            setScores(scoresData);
        } catch (err) {
            console.error("Error fetching scores:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDebaterId) {
            fetchScores(selectedDebaterId);
        } else {
            console.error("No debater selected");
        }
    };

    // Set debater ID based on the typed or selected name
    const handleDebaterSelection = (e) => {
        const name = e.target.value;
        setSearchQuery(name);

        const selectedDebater = allDebaters.find(
            (debater) => `${debater.firstName} ${debater.lastName}` === name
        );
        if (selectedDebater) {
            setSelectedDebaterId(selectedDebater.id);
        } else {
            setSelectedDebaterId(null); // Clear if no exact match
        }
    };

    return (
        <div className="graphs">
            <h1>Speaker Performance</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter speaker's name"
                    value={searchQuery}
                    onChange={handleDebaterSelection} // Handles both search and ID setting
                    list="debater-list" // Enable autofill with suggestions
                />
                <datalist id="debater-list">
                    {filteredDebaters.map((debater) => (
                        <option
                            key={debater.id}
                            value={`${debater.firstName} ${debater.lastName}`}
                        />
                    ))}
                </datalist>
                <button type="submit">Fetch Scores</button>
            </form>

            {loading && <p>Loading scores...</p>}

            {scores.length > 0 && (
                <div className="chart-container">
                    <LineChart
                        xAxis={[
                            {
                                data: tournamentDates,
                                label: "Tournament Dates",
                            },
                        ]}
                        series={[
                            {
                                data: scores, // Y-axis scores
                                label: "Scores",
                            },
                        ]}
                        width={600}
                        height={400}
                    />
                </div>
            )}
        </div>
    );
};

export default SpeakerGraphs;
