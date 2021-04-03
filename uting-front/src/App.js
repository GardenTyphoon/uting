import React from 'react';
import {BrowserRouter, Router, Route, Switch } from "react-router-dom";

// import IntroPage from './component/IntroPage'
import SignUp from './component/SignUp'
import SignIn from './component/SignIn'
function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SignIn}></Route>
          <Route path="/signup" component={SignUp}></Route>
        </Switch>
          
      </BrowserRouter>
          
    </div>
  );
}

export default App;
