import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Dashboard from './components/dashboard';
import Login from './components/login';
import Redirecting from './components/redirecting';
import PrivateRoute from './components/privateRoute';

function App() {

  return (
    <Router>
      <div className="App">
      <a href="https://prayuj.tech" id="main-logo">
        <span>
          <h2>prayuj</h2>
        </span>
        <span className="accent-style">
          <h2>.tech</h2>
        </span>
      </a>
      <Switch>
        <PrivateRoute exact path="/">
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/logs">
          <Logs />
        </PrivateRoute>
        <Route path="/t/:url">
          <Redirecting />
        </Route>
        <Route path="/login">
          <Login />
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

function Logs() {
  window.location = process.env.REACT_APP_CUSTOM_URL_ENDPOINT + '/logs';
  return <StaticPageRedirect name="Logs" />;
}

function NoMatch() {

  const urlParameters = new URLSearchParams(window.location.search);
  const target = urlParameters.has('target') ? decodeURIComponent(urlParameters.get('target')) : undefined;
  document.title = '404 - Not Found';

  return <div className="main-container">
      <div className="row justify-content-center">
        <div className="col-fluid">
          <h1 className="title">404 - Not Found</h1>
          {target ? <p>Could not redirect <span id="target">{target}</span>.</p>:''}
        </div>
      </div>
    </div>
}

function InternalError() {

  const urlParameters = new URLSearchParams(window.location.search);
  const target = urlParameters.has('target') ? decodeURIComponent(urlParameters.get('target')) : undefined;
  document.title = '500 - Internal Error';

  return <div className="main-container">
      <div className="row justify-content-center">
        <div className="col-fluid">
          <h1 className="title">500 - Internal Error</h1>
          {target ? <p>Could not redirect <span id="target">{target}</span>.</p> : ''}
        </div>
      </div>
    </div>
}

function StaticPageRedirect({name}) {
  return <div className="main-container">
    <div className="row justify-content-center">
      <div className="col-fluid">
        <h4 className="title">Redirecting to {name}</h4>
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    </div>
  </div>
}

export default App;
