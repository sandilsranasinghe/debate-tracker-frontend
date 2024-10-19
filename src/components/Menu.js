import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './css/Menu.css';

const Menu = () => {
    return (
        <nav style={{ marginBottom: '20px' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                    <Link to="/debaters" style={{ textDecoration: 'none', color: 'blue' }}>Debaters</Link>
                </li>
                <li>
                    <Link to="/judges" style={{ textDecoration: 'none', color: 'blue' }}>Judges</Link>
                </li>
                <li>
                    <Link to="/rankings" style={{ textDecoration: 'none', color: 'blue' }}>Rankings</Link>
                </li>
                <li>
                    <Link to="/tournaments" style={{ textDecoration: 'none', color: 'blue' }}>Tournaments</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
