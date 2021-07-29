import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { Redirect, Link } from "react-router-dom";
import moment from "moment";

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledTable = styled(Table)`
    text-align: center;
    color: inherit;
`;

const Logs = () => {

    document.title = 'Logs';

    const [update, setUpdate] = useState(true);
    const [logs, setLogs] = useState([]);
    const [authFails, setAuthFails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [additionalObject, setAdditionalObject] = useState({})

    const getLogs = () => {
        axios.get(process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/user-access-logs?sortBy=createdAt:desc', { withCredentials: true })
            .then(response => {
                if (response.data && response.data.logs) {
                    const logs = response.data.logs
                    logs.map(log => log.additional = JSON.parse(log.additional));
                    setLogs(logs);
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 401) setAuthFails(true)
                console.error(err)
            })
            .finally(() => setUpdate(false))
    }

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        if (update) getLogs();
    }, [update])

    if (authFails)
        return <Redirect to={{ pathname: '/login', search: `?message=${encodeURI('Wrong Cookie Set')}` }} />

    return ( 
        <StyledContainer fluid="lg">
            <Row>
                <Col xs={10} lg={11}>
                    <h1>Logs</h1>
                </Col>
                <Col xs={2} lg={1}>
                    <Link to='/'>
                        <Button>
                            <i className="fas fa-home"></i>
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <StyledTable responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>City</th>
                                <th>URL</th>
                                <th>Target</th>
                                <th>Created At</th>
                                <th>Additional Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            logs.map((log, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{log.additional ? log.additional.city : 'No City Found'}</td>
                                    <td>{log.url ? log.url : 'URL not Logged'}</td>
                                    <td>
                                        {log.target ? <Button href={log.target} target="__blank">
                                            <i className="fas fa-link"></i>
                                        </Button> : 'Target not Logged'}
                                    </td>
                                    <td>
                                        {moment(log.createdAt).fromNow()}
                                    </td>
                                    <td>
                                        <Button onClick={() => {
                                            setAdditionalObject(log.additional);
                                            handleShow();
                                        }}>
                                            <i className="fas fa-print"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactJson src={additionalObject} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </StyledContainer>
     );
}
 
export default Logs;