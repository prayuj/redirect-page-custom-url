import { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from "axios";


function App() {

  return (
    <Router>
      <div className="App">
      <a href="https://prayuj.tech" id="main-logo">
        <span>
          <h2>prayuj</h2>
        </span>
        <span class="accent-style">
          <h2>.tech</h2>
        </span>
      </a>
      <Switch>
        <Route path="/t/:url">
          <Redirecting />
        </Route>
          <Route path="/500">
            <InternalError />
          </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
      </div>
    </Router>
  );
}


function Redirecting() {
  const [targetObject, setTargetObject] = useState({});
  const getTargetURL = () => {
    try {
      const pathname = window.location.pathname;
      const target = pathname.split('/t/')[1];
      axios.get(`${process.env.REACT_APP_CUSTOM_URL_ENDPOINT}/t/${target}`)
        .then(response => {
          window.location = response.data.url
        })
        .catch(err => {
          setTargetObject({
            url: `/404?target=${encodeURIComponent(window.location.href)}`
          })
        })
    } catch (e) {
      console.error(e);
      setTargetObject({
        url: `/500?target=${encodeURIComponent(window.location.href)}`
      })
    }
  }

  useEffect(()=> {
    getTargetURL()
    return () => {
      setTargetObject({}); 
    };
  }, [])

  return <div className="main-container">
      {targetObject.url &&
        <Redirect
          to={targetObject.url}
        />}
      <div className="row justify-content-center">
        <div className="col-fluid">
          <h1 className="title">Redirecting</h1>
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      </div>
    </div>
}

function NoMatch() {

  const urlParameters = new URLSearchParams(window.location.search);
  const target = urlParameters.has('target') ? decodeURIComponent(urlParameters.get('target')) : undefined;

  return <div className="App">
    <div className="main-container">
      <div className="row justify-content-center">
        <div className="col-fluid">
          <h1 className="title">404 - Not Found</h1>
          {target ? <p>Could not redirect to <span id="target">{target}</span>.</p>:''}
        </div>
      </div>
    </div>
  </div>
}

function InternalError() {

  const urlParameters = new URLSearchParams(window.location.search);
  const target = urlParameters.has('target') ? decodeURIComponent(urlParameters.get('target')) : undefined;

  return <div className="App">
    <div className="main-container">
      <div className="row justify-content-center">
        <div className="col-fluid">
          <h1 className="title">500 - Internal Error</h1>
          {target ? <p>Could not redirect to <span id="target">{target}</span>.</p> : ''}
        </div>
      </div>
    </div>
  </div>
}

export default App;
