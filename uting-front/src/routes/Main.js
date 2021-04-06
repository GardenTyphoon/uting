import React, { useState } from 'react';
import MyProfile from "../components/MyProfile"
import RoomListForm from '../components/room/RoomListForm'

const Main = () => {
  
  return (
    <div>
      <h5>메인</h5>
      <button>MyProfile</button>
      <MyProfile />
      <RoomListForm />
    </div>
  );
};
export default Main;
