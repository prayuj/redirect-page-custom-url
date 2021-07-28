import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const ErrorPages = ({title}) => {

    const urlParameters = new URLSearchParams(window.location.search);
    const target = urlParameters.has('target') ? decodeURIComponent(urlParameters.get('target')) : undefined;
    document.title = title;

    return ( 
        <StyledContainer>
            <Row>
                <Col>
                    <h1 className="title">{title}</h1>
                    {target ? <p>Could not redirect <span id="target">{target}</span>.</p> : ''}
                </Col>
            </Row>
        </StyledContainer>
    );
}
 
export default ErrorPages;