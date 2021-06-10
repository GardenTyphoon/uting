import React, { useEffect, useState } from "react";
import axios from "axios"
const FindPassword = () => {
    const [userinfo, setUserinfo] = useState({
        name: "",
        email: "",
        phone: "",
        newPassword:""
    });
    const [code, setCode] = useState("");
    const [merchantid, setMerchantid] = useState(`mid_${new Date().getTime()}`);
    const [identity, setIdentity] = useState("");
    const [checkcode, setCheckcode] = useState();
    const [usercode, setUsercode] = useState("");
    const [nextBtn, setNextBtn] = useState(false);
    const [newPasswordTemp, setNewPasswordTemp] = useState("");
    const onChangehandler = (e) => {
        let { name, value } = e.target;
        if (name === "check-email") {
            setUsercode(value);
        } else if(name==="newPasswordTemp"){
            setNewPasswordTemp(value);
        } 
        else {
            setUserinfo({
                ...userinfo,
                [name]: value,
            });
        }
    };
    
    const changePassword = () =>{
        console.log(newPasswordTemp);
        console.log(userinfo);
        
    }
    function onClickCertification() {
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init("imp10391932");
        const data = {
            merchant_uid: merchantid,
            name: userinfo.name,
            phone: userinfo.phone,
        };
        /* 4. 본인인증 창 호출하기 */
        IMP.certification(data, callback);
    }
    function callback(response) {
        const { success, merchantid, name, phone, error_msg } = response;
        if (success) {
            setIdentity("true");
        } else {
            setIdentity("false");
        }
    }

    let sendEmail = async (e) => {
        e.preventDefault();
        const data = {
            email: userinfo.email,
        };

        if (data.email.slice(-6) === ".ac.kr") {
            const res = await axios.post(
                "http://localhost:3001/users/sendEmail",
                data
            );
            alert("해당 이메일로 인증코드를 전송했습니다.")
            setCode(res.data);

        } else {
            alert("대학교 이메일로만 가입이 가능합니다.");
        }
    };
    let check = (e) => {
        if (code === usercode) {
            setCheckcode(true);
            if (checkcode === true) {
                alert("인증코드 확인이 완료되었습니다.");
            }
        } else {
            setCheckcode(false);
            alert("인증코드가 틀렸습니다.");
        }
    };
    return (
        <div>
            {checkcode===true && nextBtn===true ?
                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                     <div>
                         <div>새 비밀번호</div>
                         <input
                         type="text"
                         name="newPasswordTemp"
                         placeholder="영문 대소문자, 숫자 및 특수문자 (!,@,#,$,%,^,&,*) 조합 8자리 "
                         style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                         onChange={(e) => onChangehandler(e)}/>
                         
                     </div>
                     <div>
                         <div>새 비밀번호 확인</div>
                         <input
                         type="text"
                         name="newPasswordTemp"
                         placeholder="새 비밀번호를 한번 더 입력하세요."
                         style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                         onChange={(e) => onChangehandler(e)}/>
                         
                     </div>
                     <div style={{ textAlign: "center" }}>
                        <button onClick= {()=>changePassword()}style={{ width: "100px" }}>변경하기</button>
                    </div>
                </div>
                : 
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="이름을 입력해주세요."
                            style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                            onChange={(e) => onChangehandler(e)} />
                        <div>
                            <input
                                type="text"
                                name="phone"
                                placeholder="전화번호를 입력해주세요. ('-' 제외)"
                                style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                                onChange={(e) => onChangehandler(e)} />
                            <button onClick={onClickCertification} style={{ width: "110px" }}>본인인증</button>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="email"
                                placeholder="학교 이메일을 입력해주세요."
                                style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                                onChange={(e) => onChangehandler(e)} />
                            <button style={{ width: "110px" }} onClick={(e) => sendEmail(e)}>이메일 인증</button>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="check-email"
                                placeholder="인증 코드를 입력해주세요."
                                style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                                onChange={(e) => onChangehandler(e)} />
                            <button style={{ width: "110px" }} onClick={(e) => check(e)}>확인</button>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button onClick= {()=>setNextBtn(!nextBtn)}style={{ width: "100px" }}>다음 단계</button>
                    </div>
                </div>}
        </div>
    )

}
export default FindPassword;