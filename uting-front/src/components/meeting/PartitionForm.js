import React from 'react';

export default function PartitionFor ()
{
  let heartplus = () =>{
    var id=React.createElement('div',{children: React.createElement('input'),className:'form-wrapper'})
    document.querySelector('.room-container').appendChild(id);
  }


  return(
    <React.Fragment>

    <div className="room-container">
      <div className='form-wrapper'>
        <input className="id-input" type='text' placeholder='ID' />
        <input type='submit' value='초대'/>
        <button className="plus" onClick={heartplus}>하트플러스</button>
      </div>
      <a href='/'>파티션만들기</a>
    </div>
    </React.Fragment>
  )
}
