import React from 'react';

const Speaker = ({ speaker }) => {
    return (
        <div>
            <p>Speaker: {speaker.name} - Score: {speaker.score}</p>
        </div>
    );
};

export default Speaker;
