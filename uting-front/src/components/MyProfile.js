import React,{useState} from "react";
import ProfileNoImage from "../img/ProfileNoImage.jpg"
const MyProfile= () => {
    const [imgBase64, setImgBase64] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [check,setCheck] = useState(false);
  
    const [ProfileInfo, setProfileInfo] = useState({
        nickname:"짱구",
        info:"아주대학교 소프트웨어학과 18학번",
        introduce:"피망은 싫어요",
        mbti:"enfp"
    });
    const [btn, setBtn] = useState("프로필 편집");
    const onClick = () => {
        if(btn==="프로필 편집"){
            setBtn("저장");
            setCheck(true);
            var inputs = document.getElementsByClassName('profile');
            for(var i=0; i<inputs.length;i++){
                inputs[i].readOnly=false;
            }

        }
        else{
            setBtn("프로필 편집");
            setCheck(false);
            var inputs = document.getElementsByClassName('profile');
            for(var i=0; i<inputs.length;i++){
                inputs[i].readOnly=true;
            }
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
            <div class="nickname">
                <input
                type="text"
                name="nickname"
                class="profile"
                value={ProfileInfo.nickname}
                onChange={onChange}
                readOnly/>
            </div>
            <div class="info">
                <input
                type="text"
                name="info"
                class="profile"
                value={ProfileInfo.info}
                onChange={onChange}
                readOnly/>
            </div>
            <div class="introduce">
                <input
                type="text"
                name="introduce"
                class="profile"
                value={ProfileInfo.introduce}
                onChange={onChange}
                readOnly/>
            </div>
            <div class="mbti">
                <input
                type="text"
                name="mbti"
                class="profile"
                value={ProfileInfo.mbti}
                onChange={onChange}
                readOnly/>
            </div>
            <button onClick={onClick}>{btn}</button>
        </div>
    )
}
export default MyProfile;