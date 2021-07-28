import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import moment from "moment";

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledTable = styled(Table)`
    color: inherit;
`;

const Logs = () => {
    const [update, setUpdate] = useState(true);
    const [logs, setLogs] = useState([]);
    const [authFails, setAuthFails] = useState(false);

    const getLogs = () => {
        axios.get(process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/all-logs?sortBy=createdAt:desc', { withCredentials: true })
            .then(response => {
                response.data && response.data.logs && setLogs(response.data.logs)
            })
            .catch(err => {
                if (err.response && err.response.status === 401) setAuthFails(true)
                console.error(err)
            })
            .finally(() => setUpdate(false))
    }

    useEffect(() => {
        if (update) getLogs();
    }, [update])

    if (authFails)
        return <Redirect to={{ pathname: '/login', search: `?message=${encodeURI('Wrong Cookie Set')}` }} />

    return ( 
        <StyledContainer fluid="lg">
            <Row>
                <Col>
                    <StyledTable responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Line</th>
                                <th>Created At</th>
                                <th>Additional Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            logs.map((log, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <p>{log.line}</p>
                                    </td>
                                    <td>
                                        {moment(log.createdAt).fromNow()}
                                    </td>
                                    <td>{log.additional?log.additional:''}</td>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>
                </Col>
            </Row>
        </StyledContainer>
     );
}
 
export default Logs;