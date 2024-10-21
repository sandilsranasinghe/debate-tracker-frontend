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
                    <Link to="/master-tab" style={{ textDecoration: 'none', color: 'blue' }}>Master Tab</Link>
                </li>
                <li>
                    <Link to="/graphs" style={{ textDecoration: 'none', color: 'blue' }}>Graphs</Link>
                </li>
                <li>
                    <Link to="/institutions" style={{ textDecoration: 'none', color: 'blue' }}>Institutions</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
