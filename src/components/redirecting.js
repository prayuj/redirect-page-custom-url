import { useState, useEffect } from 'react';
import axios from "axios";
import {
    Redirect
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Redirecting = () => {

    const [redirectURLObject, setrRedirectURLObject] = useState({});

    const getTargetURL = () => {
        try {
            const pathname = window.location.pathname;
            const target = pathname.split('/t/')[1];
            axios.get(`${process.env.REACT_APP_CUSTOM_URL_ENDPOINT}/t/${target}`)
                .then(response => {
                    window.location = response.data.url
                })
                .catch(err => {
                    setrRedirectURLObject({
                        url: `/404?target=${encodeURIComponent(window.location.href)}`
                    })
                })
        } catch (e) {
            console.error(e);
            setrRedirectURLObject({
                url: `/500?target=${encodeURIComponent(window.location.href)}`
            })
        }
    }

    useEffect(() => {
        getTargetURL()
        return () => {
            setrRedirectURLObject({});
        };
    }, [])
    
    if (redirectURLObject.url) 
    return <Redirect
        to={redirectURLObject.url}
    />

    return (<StyledContainer fluid="lg">
        <Row>
            <Col>
                <h4 className="title">Redirecting "<span className="accent-style">{window.location.href}</span>" to target URL</h4>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </Col>
        </Row>
    </StyledContainer>);

}
 
export default Redirecting;