import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import {
    Redirect
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar'
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const StyledProgressBar = styled(ProgressBar)`
    margin: 2em auto;
    .progress-bar {
        background-color: var(--accent-color);
    }
`;

const StyledH4 = styled.h4`
    text-align: center;
`;

const StyledSmall = styled.small`
    position: absolute;
    bottom: 10px;
    margin: 10px;
    text-align: center;
`;

const Redirecting = () => {

    const [redirectURLObject, setrRedirectURLObject] = useState({});
    const [message, setMessage] = useState('');
    const [shouldRun, setShouldRun] = useState(true);
    const [progressBarValue, setProgressBarValue] = useState(0);

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

        const redirectToTargetURL = async (target) => {
            try {
                let additional = {};
                let loggingPromise;
                try {
                    let tempData = await getGeoLocation()
                    additional = {
                        ip: tempData.ip_address,
                        country: tempData.country,
                        city: tempData.city,
                        timezone: tempData.timezone.abbreviation,
                        isVpn: tempData.security.is_vpn
                    }
                } catch (error) {
                    console.error(error);
                }
                axios.get(`${process.env.REACT_APP_CUSTOM_URL_LAMBDA_ENDPOINT}/t/${target}`, {
                    params: additional
                })
                .then(async (response) => {
                        try {
                            await loggingPromise;
                        } catch (error) {
                            console.error(error);
                        }
                        setProgressBarValue(100);
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
            redirectToTargetURL(target);
        }
    }, [shouldRun])

    let timerRef = useRef(null);

    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (progressBarValue < 95) {
                setProgressBarValue(progressBarValue + 1);
            } else clearTimeout(timerRef.current);
        }, 150);
    })
    
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
                <StyledProgressBar animated now={progressBarValue} />
            </Col>
        </Row>
        <StyledSmall><span className="accent-style">Source URL:</span> {window.location.host + window.location.pathname}</StyledSmall>
    </StyledContainer>);

}
 
export default Redirecting;