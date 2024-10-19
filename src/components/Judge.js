import React from 'react';

const Judge = ({ judge }) => {
    return (
        <div>
            <p>Judge: {judge.name} - Score: {judge.score}</p>
        </div>
    );
};

export default Judge;
