import React, { useState, useEffect, useCallback } from 'react';

const DebaterList = () => {
    const [debaters, setDebaters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = `http://localhost:8080/api/v1/debater`;
    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/debater`;

    // Function to fetch debaters based on the search term
    const searchDebaters = useCallback(async (name) => {
        setLoading(true); // Set loading to true at the start
        try {
            const response = await fetch(`${API_URL}?search=${name}`); // Adjust the endpoint if necessary
            if (!response.ok) {
                const errorText = await response.text(); // Read error response as text
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            }
            const data = await response.json();
            setDebaters(data);
            console.log(data); // Log fetched data
        } catch (err) {
            console.error("Error fetching debaters:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    // Initial fetch for all debaters when the component mounts
    useEffect(() => {
        searchDebaters(''); // Initial fetch can be empty or set to default value
    }, [searchDebaters]);

    return (
        <div className="app">
            <h1>Debater List</h1>
            <div className="search">
                <input
                    placeholder="Search for debaters"
                    value={searchTerm}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                    }}
                />
                <button
                    onClick={() => {
                        searchDebaters(searchTerm);
                    }}
                >
                    Search
                </button>
            </div>
            {loading && <p>Loading debaters...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {debaters.length > 0 ? (
                debaters
                    .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Order debaters by first name
                    .map(debater => (
                        <div key={debater.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                            <span style={{ fontWeight: 'bold' }}>{debater.firstName} {debater.lastName}</span>
                        </div>
                    ))
            ) : (
                <div className="empty">
                    <h2>No debaters found</h2>
                </div>
            )}
        </div>
    );
};

export default DebaterList;
