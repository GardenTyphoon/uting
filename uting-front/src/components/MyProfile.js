import React,{useEffect, useState} from "react";
import ProfileNoImage from "../img/ProfileNoImage.jpg";
import axios from "axios";

const MyProfile= () => {
    const [imgBase64, setImgBase64] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [check,setCheck] = useState(false);
    const [ProfileInfo, setProfileInfo] = useState({
        id:"",
        name:"",
        nickname:"",
        gender:"",
        birthday:"",
        email:"",
        univ:"",
        introduce:"",
        mbti:""
    });

    const [btn, setBtn] = useState("프로필 편집");

    const getMyProfile = async(e) => {
        let sessionUser = sessionStorage.getItem('email');
        let sessionObject = {"sessionUser" : sessionUser};
      
        const res = await axios.post('http://localhost:3001/users/viewMyProfile',sessionObject);
        let data = {
            _id:res.data._id,
            name:res.data.name,
            nickname:res.data.nickname,
            gender:res.data.gender,
            birthday:res.data.birth,
            email:res.data.email,
            univ:res.data.email.split('@')[1].replace(".ac.kr","")+"_univ",
            introduce:"",
            mbti:"",
        };
        setProfileInfo(data);
    }

    const onClick = async() => {
        if(btn==="프로필 편집"){ // 프로필 편집할 수 있도록 활성화
            setBtn("저장");
            setCheck(true);
            var inputs = document.getElementsByClassName('modify');
            for(var i=0; i<inputs.length;i++){
                inputs[i].readOnly=false;
            }

        }
        else{ // 편집한 프로필을 저장하고, 다시 readOnly
            setBtn("프로필 편집");
            setCheck(false);
            var inputs = document.getElementsByClassName('modify');
            for(var i=0; i<inputs.length;i++){
                inputs[i].readOnly=true;
            }
            const res = await axios.post('http://localhost:3001/users/modifyMyProfile',ProfileInfo);
        }
    }
    const onChangeImg = (event) =>{
        let reader = new FileReader();
        
        reader.onloadend = () => {
          //2. 읽기가 완료되면 아래 코드 실행
          const base64 = reader.result;
          if(base64){
            setImgBase64(base64.toString());
          }
        }
        if(event.target.files[0]){
          reader.readAsDataURL(event.target.files[0]); //1. 파일을 읽어 버퍼에 저장
          // 파일 상태 업데이트   
          setImgFile(event.target.files[0]);
          console.log(event.target.files[0]);
          
          }
        }
    const onChange = event => {
        setProfileInfo({...ProfileInfo,[event.target.name] : event.target.value})
    }
    useEffect(()=>{
        getMyProfile();
    },[])
    return (
        <div name="Profile">
            <div>
                {imgBase64 === "" ? 
                <img style={{width:"130px", height : "130px"}} src={ProfileNoImage} /> 
                :
                <img style={{width:"130px", height : "130px"}} src={imgBase64} />}
            
            </div>
            <div>
               {check===true?<input type="file" class="profile" accept = ".png" name="imgFile" id="imgFile" onChange={onChangeImg} />
               :""}
                
            </div>
            <div class="name">
                <input
                type="text"
                name="name"
                class="persistent" // 이름은 변경 못 함
                value={ProfileInfo.name}
                readOnly/>
            </div>
            <div class="nickname">
                <input
                type="text"
                name="nickname"
                class="modify" // 닉네임은 변경 가능
                value={ProfileInfo.nickname}
                onChange={onChange}
                readOnly/>
            </div>
            <div class="gender">
                <input
                type="text"
                name="gender"
                class="persistent" // 성별은 변경 못 함
                value={ProfileInfo.gender}
                readOnly/>
            </div>
            <div class="birthday">
                <input
                type="text"
                name="birthday"
                class="persistent" // 생일은 변경 못 함
                value={ProfileInfo.birthday}
                readOnly/>
            </div>
            <div class="email">
                <input
                type="text"
                name="email"
                class="persistent" // 이메일은 변경 못 함
                value={ProfileInfo.email}
                readOnly/>
            </div>
            <div class="univ">
                <input
                type="text"
                name="udniv"
                class="persistent" // 대학은 변경 못 함
                value={ProfileInfo.univ}
                readOnly/>
            </div>
            <div class="introduce">
                <input
                type="text"
                name="introduce"
                class="modify"
                value={ProfileInfo.introduce}
                onChange={onChange}
                readOnly/>
            </div>
            <div class="mbti">
                <input
                type="text"
                name="mbti"
                class="modify"
                value={ProfileInfo.mbti}
                onChange={onChange}
                readOnly/>
            </div>
            <button onClick={onClick}>{btn}</button>
        </div>
    )
}
export default MyProfile;