import React, { useEffect, useState } from 'react';
import "./Filter.css"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Input } from 'reactstrap';

const Filter = ({filterRoomTitle}) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fiternum,setFilternum]=useState(0)
    const [roomname,setRoomname]=useState("")
    const [prev,setPrev]=useState("")
    const toggle = () => setDropdownOpen(prevState => !prevState);

    let onChangehandler = (e) => {
        let { name, value } = e.target;
        //setRoomname(value)
        setRoomname("")
        console.log(value)
        if(prev.length>value.length){
            console.log("delete")
            setRoomname({
                ...roomname,
                [name]:value,
            });
        }
        else{
            setRoomname({
                ...roomname,
                [name]:value,
            });
        }
        //filterRoomTitle(value)
        setPrev(value)
    };

    useEffect(()=>{
        //console.log(roomname.name)
        if(roomname!==""){
            filterRoomTitle(roomname.name)

        }
    },[roomname])

    let filterby = (e)=>{
        if(e===1){
            setFilternum(1)
        }
        else if(e==2){
            setFilternum(2)
        }
        else if(e===3){
            setFilternum(3)
        }

    }

    return (
        <>
        <Dropdown  className="FilteredBy" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle className="FilteredBy" style={{background:"transparent", color:"#8F6F6F", border:"none"}}caret>
        Filterd by
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={(e)=>filterby(1)}>학점</DropdownItem>
        <DropdownItem onClick={(e)=>filterby(2)}>나이</DropdownItem>
        <DropdownItem onClick={(e)=>filterby(3)}>방제 검색</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    {fiternum===1?""
    :
    fiternum===2?""
    :
    fiternum===3?<div><Input name="name" onChange={(e)=>onChangehandler(e)} type="text"></Input></div>:""}
    
        </>
    )
}
export default Filter;