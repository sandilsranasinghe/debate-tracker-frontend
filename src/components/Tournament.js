import React from 'react';
import Round from './Round.js';

const Tournament = ({ tournament }) => {
    return (
        <div>
            <h2>{tournament.name}</h2>
            {tournament.rounds.map(round => (
                <Round key={round.id} round={round} />
            ))}
        </div>
    );
};

export default Tournament;
