import React from 'react';
import { useTournamentData } from '../hooks/useTournamentData.js';
import Tournament from './Tournament.js';

const TournamentList = () => {
    const tournaments = useTournamentData();

    return (
        <div>
            {tournaments.map(tournament => (
                <Tournament key={tournament.id} tournament={tournament} />
            ))}
        </div>
    );
};

export default TournamentList;
