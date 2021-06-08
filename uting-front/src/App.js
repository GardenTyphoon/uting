import React from "react";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";

// import IntroPage from './component/IntroPage'
import SignUp from "./routes/SignUp";
import Intro from "./routes/Intro";
import Main from "./routes/Main";
import Room from "./routes/Room";
import Admin from "./routes/Admin";
import Ucoin from "./routes/Ucoin";
import Ad from "./routes/Ad";
import DeviceSetup from "./components/device/DeviceSetup";
import meetingConfig from "./meetingConfig";
import { MeetingProvider } from "amazon-chime-sdk-component-library-react";
import { AppStateProvider } from "./providers/AppStateProvider";
import { NavigationProvider } from "./providers/NavigationProvider";
import axios from "axios";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppStateProvider>
          <MeetingProvider {...meetingConfig}>
            <NavigationProvider>
              <Switch>
                <Route exact path="/" component={Intro}></Route>
                <Route path="/signup" component={SignUp}></Route>
                <Route path="/main" component={Main}></Route>
                <Route path="/room:id" component={Room}></Route>
                <Route path="/admin" component={Admin}></Route>
                <Route path="/ucoin" component={Ucoin}></Route>
                <Route path="/room" component={Room}></Route>
                <Route path="/ad" component={Ad}></Route>
                <Route path="/deviceSetup" component={DeviceSetup}></Route>
              </Switch>
            </NavigationProvider>
          </MeetingProvider>
        </AppStateProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
