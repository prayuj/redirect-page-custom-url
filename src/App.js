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
import Logs from './components/logs';

function App() {

  return (
    <Router>
      <div className="App">
      <a href="https://prayujpillai.tech" id="main-logo">
        <span>
          <h2>prayujpillai</h2>
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

export default App;
