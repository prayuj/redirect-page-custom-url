import { useState, useEffect, useCallback } from 'react';
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
import { getAxiosOptions } from '../utils'

const StyledContainer = styled(Container)`
    margin-top: 75px;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
`;

const StyledTable = styled(Table)`
    text-align: center;
    color: inherit;
`;

const StyledLoadMoreButton = styled(Button)`
    max-width: 150px;
    align-self: center;
`;

const LIMIT = 20;

const Logs = () => {

    document.title = 'Logs';
    const [logs, setLogs] = useState([]);
    const [authFails, setAuthFails] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [additionalObject, setAdditionalObject] = useState({})
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [skip, setSkip] = useState(0);

    const getLogs = useCallback(() => {
        setShowLoadMore(false);
        axios(getAxiosOptions(`user-access-logs?sortBy=createdAt:desc&limit=${LIMIT}&skip=${skip}`))
            .then(response => {
                if (response.data?.logs) {

                    if (response.data.logs.length === 0) {
                        setShowLoadMore(false);
                        return;
                    }
                    const logs = response.data.logs
                    logs.map(log => {
                        try {
                            log.additional = JSON.parse(log.additional)
                        } catch (err) {
                            log.additional = {}
                        }
                        return log.additional;
                    });
                    setLogs(previousLogs => [...previousLogs, ...logs]);
                    setShowLoadMore(true);
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 401) setAuthFails(true)
                console.error(err)
            })
    }, [skip])

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        getLogs();
    }, [getLogs, skip]);

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
                                <tr key={log._id}>
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
            {showLoadMore && <StyledLoadMoreButton onClick={() => setSkip(skip + LIMIT)} variant="success">Load More</StyledLoadMoreButton>}
        </StyledContainer>
     );
}
 
export default Logs;