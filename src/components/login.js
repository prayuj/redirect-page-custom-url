import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import {setCookie} from '../utils';
import { useState } from 'react';
import { Redirect } from "react-router-dom";

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const Login = ({props}) => {
    console.log(props)
    const [value, setValue] = useState('');
    const [authSuccess, setAuthSuccess] = useState(false);

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
    </StyledContainer>
    )
}

export default Login;