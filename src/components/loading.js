import styled from "styled-components";

const StyledLoadingContainer = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
`

const LoadingComponent = styled.div `
    /*Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */
    margin: 1.0em auto;
    width: 70px;
    text-align: center;
    --size: 12px;

    > div {
        width: var(--size);
        height: var(--size);
        background-color: var(--accent-color);
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
        margin-right: 0.5em;
    }

    .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% {
        -webkit-transform: scale(0)
    }
    40% {
        -webkit-transform: scale(1.0)
    }
    }

    @keyframes sk-bouncedelay {
    0%, 80%, 100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
    }
`

const Loading = () => {
    return (
        <StyledLoadingContainer>
            <h1>Loading</h1>
            <LoadingComponent>
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </LoadingComponent>
        </StyledLoadingContainer>
     );
}
 
export default Loading;