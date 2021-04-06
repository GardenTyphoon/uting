import React, {Component} from 'react';
import {Link} from "react-router-dom";

class PartitionForm extends Component
{
  state={
    partition: "",
  };
  heartplus=()=>{
    var id=React.createElement('div',{children: React.createElement('input'),className:'form-wrapper'})
    document.querySelector('.room-container').appendChild(id);
  }
  render(){
      const {isPartitionOpen,close}=this.props;
        return(
            <React.Fragment>
            {isPartitionOpen ? (
            <div className="room-container">
              <div className='form-wrapper'>
                <input className="id-input" type='text' placeholder='ID' />
                <input type='submit' value='초대'/>
                <button className="plus" onClick={this.heartplus}>하트플러스</button>
              </div>
              <a href='/'>파티션만들기</a>
            </div>):null}
            </React.Fragment>
        )
    }
}
export default PartitionForm;

   