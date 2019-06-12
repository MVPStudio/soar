import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import birdVideo from './bird-flocks.mp4';
import './Lander.scss';

const Lander = () => {
    return (
        <div className="lander-page">
            <video autoPlay muted loop className="video-background">
                <source src={birdVideo} type="video/mp4" />
            </video>
            <div className="cta-container">
                <div className="call-to-action">
                    <h4 className="title">
                        Welcome to the SOAR Network
                    </h4>
                    <hr />
                    <div className="description">
                        The SOAR Network is a tool for building collaborative projects and recruiting volunteers to serve 
                        those without security, prosperity, and quality of life — the cornerstones of a culture of peace.
                    </div>
                    <Link className="explore-button" to="/explore">
                        <Button variant="success">Explore Organizations</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Lander;
