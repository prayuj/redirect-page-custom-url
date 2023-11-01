import { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { getAxiosOptions } from "../utils";
import styled from "styled-components";
import { Link } from "react-router-dom";
import moment from "moment";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';


const StyledContainer = styled(Container)`
    margin-top: 75px;
`;

const StyledPagination = styled(Pagination)`
    overflow-x: scroll;
    @media (min-width: 992px) {
        justify-content: center;
        overflow-x: auto;
    }
`;

const StyledAccordionItem = styled(Accordion.Item)`
    background-color: var(--lighter-dark-color);
`;

const loadingMessage = 'Fetching logs...';

const PaginationComponent = ({ numberOfPages, active, pageChange }) => {
    let items = [];
    for (let number = 1; number <= numberOfPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => pageChange(number)}>
            {number}
            </Pagination.Item>,
        );
    }
    return <StyledPagination>
            {items}
        </StyledPagination>
}

export default function Logs() {
    document.title = 'Logs';
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [active, setActive] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 20;
    const pageChange = useCallback((number) => {
        setActive(number);
        setIsLoading(true);
    }, [setActive, setIsLoading]);
    useEffect(() => {
        axios(getAxiosOptions('auth/get-number-of-logs'))
        .then(response => {
            setNumberOfPages(Math.ceil(response.data.count / limit));
            setActive(1);
        });
    }, []);
    useEffect(() => {
        if (active > 0)
            axios(getAxiosOptions('auth/logs?limit=' + limit + '&offset=' + (active - 1) * limit))
            .then(response => {
                setLogs(response.data.logs);
                setIsLoading(false);
            });
    }, [active]);
  return (
    <StyledContainer>
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
                <PaginationComponent numberOfPages={numberOfPages} active={active} pageChange={pageChange}/>
                {!isLoading ?
                    <Accordion >
                        {logs.map((log, _) =>
                            <StyledAccordionItem eventKey={log.timestamp}>
                                <Accordion.Header>
                                    {log.slug + ": " + moment(log.timestamp).format("MMMM Do YYYY, h:mm:ss a")}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <pre>
                                    {log.parameters}
                                    </pre>
                                </Accordion.Body>
                            </StyledAccordionItem>
                        )}
                    </Accordion> :
                <p>{loadingMessage}</p>
                }
            </Col>
        </Row>
    </StyledContainer>
  )
}
