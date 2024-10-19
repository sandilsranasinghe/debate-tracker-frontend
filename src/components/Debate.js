import React from 'react';
import Team from './Team.js';
import Ballot from './Ballot.js';

const Debate = ({ debate }) => {
    return (
        <div>
            <h4>Debate: {debate.id}</h4>
            {debate.teams.map(team => (
                <Team key={team.id} team={team} />
            ))}
            <div>
                <h5>Ballots:</h5>
                {debate.ballots.map(ballot => (
                    <Ballot key={ballot.id} ballot={ballot} />
                ))}
            </div>
        </div>
    );
};

export default Debate;
