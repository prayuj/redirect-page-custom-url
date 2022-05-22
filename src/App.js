import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Redirecting from './components/redirecting';
import PrivateRoute from './components/privateRoute';
import ErrorPages from './components/errorPages';
import Loading from './components/loading';
import React, { Suspense } from 'react';

const Dashboard = React.lazy(() => import('./components/dashboard'));
const Login = React.lazy(() => import('./components/login'));
const Logs = React.lazy(() => import('./components/logs'));

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
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        </PrivateRoute>
        <PrivateRoute exact path="/logs">
          <Suspense fallback={<Loading />}>
            <Logs />
          </Suspense>
        </PrivateRoute>
        <Route path="/t/:url">
          <Redirecting />
        </Route>
        <Route path="/login">
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
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
