import React, {Component} from 'react';
import RoomList from './RoomList.js';
import PartitionForm from './PartitionForm'

class RoomListForm extends Component
{
    constructor(props){
        super(props);
        this.state={
            isPartitionOpen: false,
        };
    }
    openModal = () =>{
        this.setState({isPartitionOpen: true});
    }
    closeModal = () =>{
        this.setState({isPartitionOpen: false});
    }
    
    render(){
        return(
            <React.Fragment>
                <RoomList></RoomList>
                <button>빠른매칭</button>
                <button>설정</button>
                <button>리프레쉬</button>
                <button>뒤로가기</button>
                <button>파티션정보</button>
                <button onClick={this.openModal}>파티션생성</button>
                <PartitionForm isPartitionOpen={this.state.isPartitionOpen} close={this.closeModal}/>
            </React.Fragment>
        )
    }
}
export default RoomListForm;