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
import { Redirect, Link } from "react-router-dom";
import { getAxiosOptions } from '../utils'

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledAlert = styled(Alert)`
    position: fixed;
    bottom: 0;
    left: 15px;
`;

const StyledTable = styled(Table)`
    color: inherit;
`;

const Dashboard = () => {

    document.title = 'Dashboard';

    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    const [update, setUpdate] = useState(true);
    const [alertObject, setAlertObject] = useState({show: false});
    const [urls, setURLs] = useState([]);
    const [urlObject, setURLObject] = useState({show: false});
    const [authFails, setAuthFails] = useState(false);

    const deleteUrl = (url) => {

        axios(getAxiosOptions('url', 'DELETE', { url }))
        .then(data => {
                if (!data.error) {
                    setUpdate(true);
                }
            })
        .catch(err => console.error(err))
    }

    const shortenUrl = (event) => {
        event.preventDefault();
        setDisableSubmitBtn(true);
        const url = event.target.url.value
        const title = event.target.title.value

        axios(getAxiosOptions('shorten-url', 'POST', { url, title }))
        .then(response => {
            setUpdate(true);
            setURLObject({
                show: true, 
                url: response.data.url
            });
        })
            .catch((error) => {
                const errorResponse = error.response;
                showAlert(
                    `Error: 
                    <b>
                        ${errorResponse && errorResponse.data && errorResponse.data.error ? errorResponse.data.error : 'An Error Occured'}
                    </b>`,
                    'danger')
            })
        .finally(() => setDisableSubmitBtn(false))
    }

    useEffect(() => {
        const getURLs = () => {
            axios(getAxiosOptions('all-urls', 'GET'))
                .then(response => {
                    response.data && response.data.urls && setURLs(response.data?.urls?.sort((a, b)=>b.hits - a.hits));
                })
                .catch(err => {
                    if (err.response && err.response.status === 401) setAuthFails(true)
                    console.error(err)
                })
                .finally(() => setUpdate(false))
        }
        if(update) getURLs();
    }, [update, disableSubmitBtn])

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        showAlert(`Copied <b>${str}</b> to the clipboard`, 'primary');
    };

    const showAlert = (message, variant) => {
        setAlertObject({ show: true, message, variant})
        setTimeout(() => setAlertObject({ show: false, message, variant: variant }), 5000)
    }

    if (authFails)
        return <Redirect to={{ pathname: '/login', search: `?message=${encodeURI('Wrong Cookie Set')}`}} />
    return ( 
        <StyledContainer fluid="lg">
            <Row>
                <Col xs={10} lg={11}>
                    <h1>Prayuj's URL Shortener</h1>
                </Col>
                <Col xs={2} lg={1}>
                    <Link to='/logs'>
                        <Button>
                            <i className="fas fa-print"></i>
                        </Button>
                    </Link>
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
                        <Button variant="primary" type="submit" disabled={disableSubmitBtn}>
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
                        <i className="far fa-copy"></i>
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
                                <th>Copy</th>
                                <th>To</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map((url, index) => 
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{url.fromUrl}</td>
                                    <td>{url.hits >= 0 ? url.hits : 'No Data'}</td>
                                    <td>
                                        <Button variant='success' onClick={() => copyToClipboard(window.location.origin + "/t/" + url.fromUrl)}>
                                            <i className="far fa-copy"></i>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="secondary" size="sm" href={url.toUrl} target="__blank">
                                            <i className="fas fa-link"></i>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button size="sm" variant='danger' onClick={() => deleteUrl(url.fromUrl)}>
                                            <i className="far fa-trash-alt"></i>
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
                    <StyledAlert show={alertObject.show} variant={alertObject.variant}>
                        <div dangerouslySetInnerHTML={{__html: alertObject.message}} />
                    </StyledAlert>
                </Col>
            </Row>
        </StyledContainer>
     );
}
 
export default Dashboard;