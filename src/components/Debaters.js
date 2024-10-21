import React, { useState, useEffect, useCallback } from 'react';
import './css/Debaters.css';

const Debaters = () => {
    const [debaters, setDebaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDebaters, setSelectedDebaters] = useState([]);

    const API_URL = `http://localhost:8080/api/v1/debater`;
    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/debater`;

    // Function to fetch debaters based on the search term
    const searchDebaters = useCallback(async (name) => {
        setLoading(true); // Set loading to true at the start
        try {
            const response = await fetch(`${API_URL}?search=${name}`);
            if (!response.ok) {
                const errorText = await response.text(); // Read error response as text
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            }
            const data = await response.json();
            setDebaters(data);
            setSelectedDebaters([]); // Clear selected debaters after fetching new data
        } catch (err) {
            console.error("Error fetching debaters:", err);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Initial fetch for all debaters when the component mounts
    useEffect(() => {
        searchDebaters(''); // Initial fetch can be empty or set to default value
    }, [searchDebaters]);

    const handleCheckboxChange = (id) => {
        if (selectedDebaters.includes(id)) {
            // Remove id from selected list
            setSelectedDebaters(selectedDebaters.filter(item => item !== id));
        } else {
            // Add id to selected list
            setSelectedDebaters([...selectedDebaters, id]);
        }
    };

    const handleMerge = async () => {
        if (selectedDebaters.length === 2) {
            // Call API to merge selected debaters
            console.log('Selected Debaters:', selectedDebaters);
            // Implement API call for merging debaters here
            const response = await fetch(API_URL + "/replace", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldDebaterId: selectedDebaters[0], newDebaterId: selectedDebaters[1] }),
            });
            const result = await response.json();
            console.log(`Merge Result: ${result.message}`);

            setSelectedDebaters([]); // Reset selection after merging
            await searchDebaters(); // Refresh the list
        } else if (selectedDebaters.length === 1 || selectedDebaters.length === 0) {
            alert('Please select at least one debater.');
        } else {
            alert('Please select only two debaters to merge.');
        }

    };

    return (
        <div className="app">
            <h1>Debater List</h1>
            {loading ? (
                <p>Loading debaters...</p>
            ) : debaters.length > 0 ? (
                <div className="debater-list">
                    {debaters
                        .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Order debaters by first name
                        .map(debater => (
                            <div key={debater.id} className="debater-row" onClick={() => handleCheckboxChange(debater.id)}>
                                <input
                                    type="checkbox"
                                    checked={selectedDebaters.includes(debater.id)}
                                    onChange={() => handleCheckboxChange(debater.id)}
                                />
                                <span className="debater-name">
                                    {debater.firstName} {debater.lastName}
                                </span>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="empty">
                    <h2>No debaters found</h2>
                </div>
            )}
            {/* Sticky Merge Button */}
            <div className="merge-button-container">
                <button onClick={handleMerge} disabled={selectedDebaters.length === 0}>
                    Merge Selected
                </button>
            </div>
        </div>
    );
};

export default Debaters;
