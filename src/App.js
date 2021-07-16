import './App.css';
import Login from './layouts/Login/Login';
import Routes from './routes/Routes';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => 
(  
  <Route {...rest} render={props => 
  (
    localStorage.getItem('token') ? <Component {...props} /> : <Redirect to={{pathname: '/login'}}/>
  )}/>
);


function App() {
  return (
    <Router>
    <Switch>
      <PrivateRoute path="/" component={Routes} exact />

      <Route path="/login" component={Login} />
    </Switch>      
  </Router>
  );
}

export default App;
