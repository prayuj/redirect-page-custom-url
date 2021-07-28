import {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Redirect } from "react-router-dom";

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledAlert = styled(Alert)`
    position: fixed;
    bottom: 0;
    left: 5em;
`;

const StyledTable = styled(Table)`
    color: inherit;
`;

const Dashboard = () => {

    document.title = 'Dashboard';

    const [update, setUpdate] = useState(true);
    const [alertObject, setAlertObject] = useState({show: false});
    const [urls, setURLs] = useState([]);
    const [urlObject, setURLObject] = useState({show: false});
    const [authFails, setAuthFails] = useState(false);

    const getURLs = () => {
        axios.get(process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/all-urls', { withCredentials: true })
            .then(response => {
                response.data && response.data.urls && setURLs(response.data.urls)
            })
            .catch(err => {
                if(err.response && err.response.status === 401) setAuthFails(true)
                console.error(err)
            })
            .finally(() => setUpdate(false))
    }

    const deleteUrl = (id) => {
        axios({
            url: process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/url',
            method: 'delete',
            data: {
                id
            },
            withCredentials: true
        })
        .then(data => {
                if (!data.error) {
                    setUpdate(true);
                }
            })
        .catch(err => console.error(err))
    }

    const shortenUrl = (event) => {
        event.preventDefault();
        const url = event.target.url.value
        const title = event.target.title.value
        axios({
            url: process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/shorten-url',
            method: 'post',
            data: {
                url, 
                title
            },
            withCredentials: true
        })
        .then(response => {
            setUpdate(true);
            setURLObject({
                show: true, 
                url: response.data.url
            });
        })
        .catch()
    }

    useEffect(() => {
        if(update) getURLs();
    }, [update])

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setAlertObject({ show: true, message: str })
        setTimeout(() => setAlertObject({ show: false, message: str }), 5000)
    };

    if (authFails)
        return <Redirect to={{ pathname: '/login', search: `?message=${encodeURI('Wrong Cookie Set')}`}} />
    return ( 
        <StyledContainer fluid="lg">
            <Row>
                <Col xs={10}>
                    <h1>Prayuj's URL Shortener</h1>
                    
                </Col>
                <Col xs={2}>
                    <Button>
                        <i class="fas fa-print"></i>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={shortenUrl}>
                        <Form.Group className="mb-3">
                            <Form.Label>URL to Shorten</Form.Label>
                            <Form.Control type="url" placeholder="Enter URL" name="url"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Custom Title</Form.Label>
                            <Form.Control type="text" placeholder="Custom Title" name="title"/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            {
            urlObject.show &&
            <Row>
                <Col xs={10}>
                    <p>{window.location.origin + "/t/" + urlObject.url}</p>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => copyToClipboard(window.location.origin + "/t/" + urlObject.url)}>
                        <i class="far fa-copy"></i>
                    </Button>
                </Col>
            </Row>
            }
            <Row>
                <Col id='copy-message'>
                </Col>
            </Row>
            <Row>
                <Col>
                    <StyledTable responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Count</th>
                                <th>To</th>
                                <th>Delete</th>
                                <th>Copy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map((url, index) => 
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{url.fromUrl}</td>
                                    <td>{url.count >= 0 ? url.count : 'No Data'}</td>
                                    <td>
                                        <Button href={url.toUrl} target="__blank">
                                            <i class="fas fa-link"></i>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => deleteUrl(url._id)}>
                                            <i class="far fa-trash-alt"></i>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button onClick={() => copyToClipboard(window.location.origin + "/t/" + url.fromUrl)}>
                                            <i class="far fa-copy"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </Col>
            </Row>
            <Row>
                <Col>
                    <StyledAlert show={alertObject.show} variant='primary'>
                            Copied <b>{alertObject.message}</b> to the clipboard
                    </StyledAlert>
                </Col>
            </Row>
        </StyledContainer>
     );
}
 
export default Dashboard;