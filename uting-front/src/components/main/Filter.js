import React, { useEffect, useState } from "react";
import "./Filter.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";

const Filter = ({ filterRoomTitle, filterManner, filterAge }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fiternum, setFilternum] = useState(0);
  const [roomname, setRoomname] = useState("");
  const [prev, setPrev] = useState("");
  const [filtermanner, setFiltermanner] = useState({ first: "", last: "" });
  const [filterage, setFilterage] = useState({ first: "", last: "" });
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    if (name === "name") {
      setRoomname({
        ...roomname,
        [name]: value,
      });
    }

    if (name === "firstManner") {
      setFiltermanner({ ...filtermanner, ["first"]: Number(value) });
    }
    if (name === "lastManner") {
      setFiltermanner({ ...filtermanner, ["last"]: Number(value) });
    }
    if (name === "firstAge") {
      setFilterage({ ...filterage, ["first"]: Number(value) });
    }
    if (name === "lastAge") {
      setFilterage({ ...filterage, ["last"]: Number(value) });
    }
  };

  useEffect(() => {
    if (filtermanner.first !== "" && filtermanner.last !== "") {
      filterManner(filtermanner);
    }
  }, [filtermanner]);

  useEffect(() => {
    if (filterage.first !== "" && filterage.last !== "") {
      filterAge(filterage);
    }
  }, [filterage]);

  useEffect(() => {
    if (roomname !== "") {
      filterRoomTitle(roomname.name);
    }
  }, [roomname]);

  let filterby = (e) => {
    if (e === 1) {
      setFilternum(1);
    } else if (e == 2) {
      setFilternum(2);
    } else if (e === 3) {
      setFilternum(3);
    }
  };

  return (
    <>
      <Dropdown className="FilteredBy" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          className="FilteredBy"
          style={{
            background: "transparent",
            color: "rgb(89,57,70)",
            fontWeight: "bold",
            border: "none",
          }}
          caret
        >
          Filter
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={(e) => filterby(1)}>학점</DropdownItem>
          <DropdownItem onClick={(e) => filterby(2)}>나이</DropdownItem>
          <DropdownItem onClick={(e) => filterby(3)}>방제 검색</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {fiternum === 1 ? (
        <span>
          <Input
            style={{ width: "45%", display: "inline-block", marginLeft: "1%" }}
            type="select"
            name="firstManner"
            onChange={(e) => onChangehandler(e)}
          >
            <option value="default" selected>
              高
            </option>
            <option value="4.5">A+</option>
            <option value="4.0">A0</option>
            <option value="3.5">B+</option>
            <option value="3.0">B0</option>
            <option value="2.5">C+</option>
            <option value="2.0">C0</option>
            <option value="1.5">D+</option>
            <option value="1.0">D0</option>
            <option value="0">F</option>
          </Input>
          ~
          <Input
            style={{ width: "45%", display: "inline-block" }}
            type="select"
            name="lastManner"
            onChange={(e) => onChangehandler(e)}
          >
            <option value="default" selected>
              低
            </option>
            <option value="4.5">A+</option>
            <option value="4.0">A0</option>
            <option value="3.5">B+</option>
            <option value="3.0">B0</option>
            <option value="2.5">C+</option>
            <option value="2.0">C0</option>
            <option value="1.5">D+</option>
            <option value="1.0">D0</option>
            <option value="0">F</option>
          </Input>
        </span>
      ) : fiternum === 2 ? (
        <span>
          <Input
            style={{
              width: "20%",
              display: "inline-block",
              marginLeft: "5%",
              marginRight: "2%",
            }}
            placeholder="高"
            type="text"
            name="firstAge"
            onChange={(e) => onChangehandler(e)}
          />
          ~
          <Input
            style={{ width: "20%", display: "inline-block", marginLeft: "2%" }}
            placeholder="低"
            type="text"
            name="lastAge"
            onChange={(e) => onChangehandler(e)}
          />
        </span>
      ) : fiternum === 3 ? (
        <div>
          <Input
            style={{ width: "90%", marginLeft: "5%", marginRight: "2%" }}
            name="name"
            onChange={(e) => onChangehandler(e)}
            type="text"
          ></Input>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default Filter;
