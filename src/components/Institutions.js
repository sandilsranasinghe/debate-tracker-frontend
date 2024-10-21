import React, { useState, useEffect, useCallback } from 'react';
import './css/Institutions.css';

const Institutions = () => {
    const [institutions, setInstitution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInstitutions, setSelectedInstitutions] = useState([]);

    const API_URL = `http://localhost:8080/api/v1/institution`;

    const searchInstitutions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            }
            const data = await response.json();
            setInstitution(data);
            setSelectedInstitutions([]); // Clear selected institutions after fetching new data
        } catch (err) {
            console.error("Error fetching institutions:", err);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        searchInstitutions();
    }, [searchInstitutions]);

    const handleCheckboxChange = (id) => {
        if (selectedInstitutions.includes(id)) {
            setSelectedInstitutions(selectedInstitutions.filter(item => item !== id));
        } else {
            setSelectedInstitutions([...selectedInstitutions, id]);
        }
    };

    const handleRowClick = (id) => {
        handleCheckboxChange(id); // Toggle selection when row is clicked
    };

    const handleMerge = async () => {
        if (selectedInstitutions.length > 0) {
            console.log('Selected Institutions:', selectedInstitutions);
            const response = await fetch(API_URL + "/merge", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ institutionIds: selectedInstitutions }),
            });
            const result = await response.json();
            console.log(`Merge Result: ${result.message}`);
            setSelectedInstitutions([]);
            await searchInstitutions();
        } else {
            alert('Please select at least one institution.');
        }
    };

    return (
        <div className="app">
            <h1>Institution List</h1>
            <table>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Id</th>
                    <th>Institution Name</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="3">Loading institutions...</td>
                    </tr>
                ) : institutions.length > 0 ? (
                    institutions
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((institution) => (
                            <tr key={institution.id} onClick={() => handleRowClick(institution.id)}>
                                <td className={"checkbox-container"}>
                                    <input
                                        type="checkbox"
                                        checked={selectedInstitutions.includes(institution.id)}
                                        readOnly // Prevent checkbox change from affecting selection directly
                                    />
                                </td>
                                <td className="institution-id">{institution.id}</td>
                                <td className="institution-name">{institution.name}</td>
                            </tr>
                        ))
                ) : (
                    <tr>
                        <td colSpan="3" className="empty">
                            <h2>No institutions found</h2>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Sticky Merge Button */}
            <div className="merge-button-container" style={{ position: 'sticky', bottom: 0, background: '#fff', zIndex: 100 }}>
                <button onClick={handleMerge} disabled={selectedInstitutions.length === 0}>
                    Merge Selected
                </button>
            </div>
        </div>
    );
};

export default Institutions;
