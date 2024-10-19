import { useContext } from 'react';
import { TournamentContext } from '../contexts/TournamentContext.js';

export const useTournamentData = () => {
    const { tournaments } = useContext(TournamentContext);
    return tournaments;
};
