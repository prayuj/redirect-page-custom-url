import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import {setCookie} from '../utils';
import { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledAlert = styled(Alert)`
    position: fixed;
    bottom: 0;
    left: 15px;
`;

const Login = ({props}) => {
    const [value, setValue] = useState('');
    const [authSuccess, setAuthSuccess] = useState(false);
    const [alertObject, setAlertObject] = useState({show: false});

    useEffect(() => {
        const searchObject = new URLSearchParams(window.location.search);
        if (searchObject.has('message')) 
        setAlertObject({
            show: true, 
            message: searchObject.get('message')
        });
    }, []);

    if (authSuccess)
        return <Redirect to='/' />

    return (
    <StyledContainer fluid="lg">
        <Row>
            <Col xs={10}>
                <h1>Prayuj's URL Shortener</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form onSubmit={(event)=>{
                    event.preventDefault();
                    setCookie(value);
                    setAuthSuccess(true);
                }}>
                    <Form.Group className="mb-3">
                        <Form.Label>Set Cookie to Access Content</Form.Label>
                        <Form.Control type="text" placeholder="Enter Cookie Value" value={value} onInput={(e)=>setValue(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>
        <Row>
            <Col>
                <StyledAlert show={alertObject.show} variant='primary'>
                    <b>{alertObject.message}</b>
                </StyledAlert>
            </Col>
        </Row>
    </StyledContainer>
    )
}

export default Login;