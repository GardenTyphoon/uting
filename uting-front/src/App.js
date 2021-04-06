import React from 'react';
import {BrowserRouter, Router, Route, Switch } from "react-router-dom";

// import IntroPage from './component/IntroPage'
import SignUp from './routes/user/SignUp'
import Intro from './routes/Intro'
import Main from './routes/Main'
import Room from './routes/Room'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Intro}></Route>
          <Route path="/signup" component={SignUp}></Route>
          <Route path="/main" component={Main}></Route>
          <Route path="/room:id" component={Room}></Route>
        </Switch>
          
      </BrowserRouter>
          
    </div>
  );
}

export default App;
