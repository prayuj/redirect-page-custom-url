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
import ErrorPages from './components/errorPages';

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
            <ErrorPages title="500 - Internal Error" />
        </Route>
        <Route path="*">
            <ErrorPages title="404 - Not Found" />
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
