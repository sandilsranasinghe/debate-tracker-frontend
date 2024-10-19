import React, { createContext, useState, useEffect } from 'react';
import { fetchTournaments } from '../services/api.js';

export const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const loadTournaments = async () => {
            const data = await fetchTournaments();
            setTournaments(data);
        };
        loadTournaments();
    }, []);

    return (
        <TournamentContext.Provider value={{ tournaments }}>
            {children}
        </TournamentContext.Provider>
    );
};
