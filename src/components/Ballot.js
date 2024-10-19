import React from 'react';

const Ballot = ({ ballot }) => {
    return (
        <div>
            <p>Judge: {ballot.judge.name} - Speaker Score: {ballot.speaker_score}</p>
        </div>
    );
};

export default Ballot;
