import axios from "axios";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { getAxiosOptions } from "../utils";
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Pagination from 'react-bootstrap/Pagination';
import PageItem from 'react-bootstrap/PageItem'

const StyledContainer = styled(Container)`
    margin-top: 75px;
`;
const StyledTable = styled(Table)`
    color: inherit;
`;

const StyledPagination = styled(Pagination)`
    justify-content: center;
`;

const Timestamp = styled.td`
    font-size: 0.8rem;
`

const Logs = () => {

    const [availableStreams, setAvailableStreams] = useState([]);
    const [currentStream, setCurrentStream] = useState("");
    const [logs, setLogs] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState("Fetching Logs...");

    const streamToLogsMapping = useRef({});

    useEffect(() => {
        const fetchAvailableStreams = async () => {
            try {
                const response = await axios(getAxiosOptions("get-cloudwatch-log-streams", "GET"));
                if (response.data?.logStreams) {
                    setAvailableStreams(response.data.logStreams);
                }
            } catch (error) {
                setLoadingMessage("Error fetching logs: " + error.message);
            }
        }
        fetchAvailableStreams();
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if (streamToLogsMapping.current[currentStream]) {
                    setLogs(streamToLogsMapping.current[currentStream]);
                    return;
                }
                const response = await axios(getAxiosOptions("get-logs-from-stream", "GET", {}, {
                    logStreamName: currentStream
                }));
                if (response.data?.events){
                    console.log(response.data.events);
                    streamToLogsMapping.current[currentStream] = response.data.events;
                    setLogs(response.data.events);
                }
            }
            catch (error) {
                setLoadingMessage("Error fetching logs: " + error.message);
            }
        };
        setLogs([]);
        if(currentStream) {
            fetchLogs();
        }
    }, [currentStream]);

    useEffect(() => {
        setCurrentStream(availableStreams[0]?.logStreamName);
    }, [availableStreams]);

    return ( <StyledContainer>
        <Row>
            <Col>
                <StyledPagination>
                    {availableStreams.map((stream, index) => 
                        <PageItem key={stream.logStreamName} active={currentStream === stream.logStreamName} onClick={() => setCurrentStream(stream.logStreamName)}>{index+1}</PageItem>
                    )}
                </StyledPagination>
                {logs.length > 0 ? 
                    <StyledTable responsive>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => 
                                <tr key={index}>
                                    <Timestamp>{moment(log.timestamp).format("MMMM Do YYYY, h:mm:ss a")}</Timestamp>
                                    <td>{log.message}</td>
                                </tr>)}
                        </tbody>

                    </StyledTable> : <p>{loadingMessage}</p>}
            </Col>
        </Row>
    </StyledContainer> );
}
 
export default Logs;