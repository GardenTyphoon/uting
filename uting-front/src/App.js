import React from 'react';
import {BrowserRouter, Router, Route, Switch } from "react-router-dom";

// import IntroPage from './component/IntroPage'
import SignUp from './components/user/SignUp'
import Intro from './components/Intro'
import Main from './components/Main'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Intro}></Route>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/main" component={Main}></Route>
        </Switch>
          
      </BrowserRouter>
          
    </div>
  );
}

export default App;
