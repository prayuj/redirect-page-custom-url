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


const StyledH4 = styled.h4`
    text-align: center;
`;

const StyledH6 = styled.h6`
    text-align: center;
`;

const Redirecting = () => {

    const [redirectURLObject, setrRedirectURLObject] = useState({});
    const [message, setMessage] = useState('');
    const [shouldRun, setShouldRun] = useState(true);

    const getGeoLocation = async () => {
        try {
            const response =  await axios.get(process.env.REACT_APP_ABSTRACT_API);
            return response.data;
        } catch(e) {
            console.error(e);
            return {
                message: e.message || 'An Error fetching IP information'
            }
        }
    }

    useEffect(() => {

        const getMessage = (search) => {
            const queryParams = new URLSearchParams(search);
            setMessage(queryParams.get('message') || 'target URL');
        }

        const logUserInfo = async (target) => {
            let additional = {};
            try {
                additional = await getGeoLocation()
                axios.post(`${process.env.REACT_APP_CUSTOM_URL_ENDPOINT}/log/${target}`, { additional })
            } catch (error) {
                console.error(error);
            }
        }

        const redirectToTargetURL = (target) => {
            try {
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
        if (shouldRun) {
            setShouldRun(false);
            getMessage(window.location.search);

            const pathname = window.location.pathname;
            const target = pathname.split('/t/')[1];
            logUserInfo(target);
            redirectToTargetURL(target);
        }
    }, [shouldRun])
    
    if (redirectURLObject.url) 
    return <Redirect
        to={redirectURLObject.url}
    />

    return (<StyledContainer fluid="lg">
        <Row>
            <Col>
                <StyledH4>Redirecting to
                    {
                    message !== undefined && message !== 'target URL'? 
                        <span className="accent-style" style={{display: 'inline-block', marginLeft: '0.3em'}}> {'"' + message + '"'}</span>
                        : <> {message}</>
                    }
                    </StyledH4>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                <StyledH6><span className="accent-style">Source URL:</span> {window.location.host + window.location.pathname}</StyledH6>
            </Col>
        </Row>
    </StyledContainer>);

}
 
export default Redirecting;