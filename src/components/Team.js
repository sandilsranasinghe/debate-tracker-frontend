import React from 'react';
import Speaker from './Speaker.js';

const Team = ({ team }) => {
    return (
        <div>
            <h4>Team: {team.name}</h4>
            {team.speakers.map(speaker => (
                <Speaker key={speaker.id} speaker={speaker} />
            ))}
        </div>
    );
};

export default Team;
