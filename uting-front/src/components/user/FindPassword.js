import React, { useEffect, useState } from "react";

const FindPassword = () => {
    const [userinfo, setUserinfo] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const onChangehandler = (e) => {
        let { name, value } = e.target;
        setUserinfo({
            ...userinfo,
            [name]: value,
        });
        console.log(userinfo);
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems:"center" }}>
            <div>
            <input
                type="text"
                name="name"
                placeholder="이름을 입력해주세요."
                style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                onChange={(e) => onChangehandler(e)} />
            <div>
                <input
                    type="number"
                    name="phone"
                    placeholder="전화번호를 입력해주세요. ('-' 제외)"
                    style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                    onChange={(e) => onChangehandler(e)} />
                <button style={{width:"110px"}}>본인인증</button>
            </div>
            <div>
                <input
                    type="text"
                    name="email"
                    placeholder="학교 이메일을 입력해주세요."
                    style={{ width: "300px", fontFamily: "NanumSquare_acR", margin: "10px" }}
                    onChange={(e) => onChangehandler(e)} />
                <button style={{width:"110px"}}>이메일 인증</button>
            </div>
            </div>
            <div style={{textAlign:"center"}}>
            <button style={{width:"100px"}}>다음 단계</button>
            </div>
        </div>
    )

}
export default FindPassword;