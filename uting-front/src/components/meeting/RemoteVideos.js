import React, { memo, useState, useEffect } from "react";
import camera_on from "../../img/cam_on.png";
import camera_off from "../../img/cam_off.png";
import { useAppState } from "../../providers/AppStateProvider";
import "./RemoteVideos.css";
import {
  useRemoteVideoTileState,
  RemoteVideo,
  useRosterState,
  Grid,
} from "amazon-chime-sdk-component-library-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import styled from "styled-components";
import MyProfile from "../profile/MyProfile";

const my_style = {
  width: "auto",
  height: "auto",
};
const temp = {
  background: "white",
  border: "15px solid white",
  borderRadius: "30px",
};
const info = {};

let alive = [];

export const RemoteVideos = (props) => {
  const { roster } = useRosterState();
  const { tiles, tileIdToAttendeeId } = useRemoteVideoTileState();
  const [remoteView, setremoteView] = useState(true);
  const [toggleprofile, setToggleProfile] = useState(false);
  const [anotherName, setAnotherName] = useState("");
  const [alive, setalive] = useState({});

  const toggleProfileBtn = (e) => {
    setAnotherName(e);
    setToggleProfile(!toggleprofile);
  };

  const onChange = (tileId) => {
    setalive({
      ...alive,
      [tileId]: !alive[tileId],
    });
    console.log(alive);
  };

  return (
    <>
      {tiles.map((tileId) => {
        const attendee = roster[tileIdToAttendeeId[tileId]] || {};
        let name = "";
        for (let property in props.info.info) {
          if (attendee.chimeAttendeeId == property) {
            name = props.info.info[property];
            break;
          }
        }

        return (
          <div style={temp}>
            <Grid
              responsive
              gridTemplateRows="repeat(1, 2vw) repeat(1, 14vw)"
              gridAutoFlow="dense"
              color="white"
            >
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div onClick={() => onChange(tileId)}>
                  {alive[tileId] ? (
                    <img style={my_style} src={camera_on} />
                  ) : (
                    <img style={my_style} src={camera_off} />
                  )}
                </div>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button
                    onClick={(e) => {
                      toggleProfileBtn(name);
                    }}
                    className="anotherbutton"
                  >
                    {name}
                  </button>
                </div>
              </div>
              {alive[tileId] ? (
                <RemoteVideo {...props} key={tileId} tileId={tileId} />
              ) : (
                <div style={temp}></div>
              )}
            </Grid>
          </div>
        );
      })}
      <Modal isOpen={toggleprofile}>
        <ModalBody isOpen={toggleprofile} style={{ background: "#FFB4AC" }}>
          <button
            onClick={(e) => {
              toggleProfileBtn(e);
            }}
            style={{
              background: "transparent",
              border: "none",
              position: "absolute",
              left: "90%",
            }}
          >
            X
          </button>
          <MyProfile choicename={anotherName} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default memo(RemoteVideos);
