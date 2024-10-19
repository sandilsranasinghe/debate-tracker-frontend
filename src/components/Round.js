import React from 'react';
import Debate from './Debate.js';

const Round = ({ round }) => {
    return (
        <div>
            <h3>{round.name}</h3>
            {round.debates.map(debate => (
                <Debate key={debate.id} debate={debate} />
            ))}
        </div>
    );
};

export default Round;
