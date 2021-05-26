import React, { useEffect, useState } from "react";
import { Route, Link, Switch, Router, useHistory } from "react-router-dom";
import {
  Button,
  Collapse,
  CardBody,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import "./Ad.css"
import utingLogo from "../img/utingLogo.png";

const Ad = () => {
    
  
    return (
     <div className="adContainer" >
         <img className="utingLogo" src={utingLogo} />
            <div className="contactus">Contact Us</div>
            <div>
            <div className="request">문의 약관</div>
            <div className="checkcontent">
                ‘U-TING’(이하 ‘회사’)은 고객님의 개인정보를 중요시하며, “정보통신망 이용촉진 및 정보보호”에 관한 법률을 준수하고 있습니다.<br/>
회사는 개인정보 처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.<br/>회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.<br/><br/>

[수집하는 개인정보 항목]<br/>
회사는 원활한 고객상담 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.<br/>
수집항목: 이름, 이메일<br/><br/>

[개인정보의 수집 및 이용목적]<br/>
가. 개인식별 및 서비스 문의에 대한 응대<br/><br/>

[개인정보의 보유 및 이용기간]<br/>
이용자의 개인정보는 원칙적으로, 개인정보 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.<br/><br/>

가. 회사 내부 방침에 의한 정보보유 사유<br/>
부정이용 기록 보존 이유 : 부정 이용 예방 및 방지, 보존 기간 : 1년<br/><br/>

나. 관계법령에 의한 정보보유 사유<br/>
상법, 전자상거래법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 아래와 같습니다.<br/><br/>

- 소비자의 불만 또는 분쟁처리에 관한 기록 | 보존 이유 : 전자상거래법, 보존 기간 : 3년<br/>
- 본인 확인에 관한 기록 | 보존 이유 : 정보통신망법, 보존 기간 : 6개월<br/>
- 방문에 관한 기록(통신사실확인자료) | 보존 이유 : 통신비밀 보호법, 보존 기간 : 3개월</div>
</div>
    <div className="formcheck" style={{float:"left" ,marginLeft:"15%",marginTop:"1%"}}><input type="radio"/><span style={{marginLeft:"1%"}}>개인 정보 취급 방침에 동의합니다.</span></div>

    <div className="tablediv">
        <table>
            <tbody>
                <tr>
                    <th >질문유형</th>
                    <td>
                        <div>
                            <input type="radio" name="inquiryCd" value="Ad" checked="checked"/><label for="inquiryCd1">광고</label>
                            <input type="radio" name="inquiryCd" value="another"/><label for="inquiryCd1">기타</label>
                        </div>
                    </td>

                </tr>
                <tr>
                    <th>성, 이름</th>
                    <td>
                        <div>
                            <input type="text" name="last" placeholder="성"/>
                            <input type="text" name="first" placeholder="이름" />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>
                        <div className="emailinfo">
                            <input style={{width:"150px" ,float:"left"}} type="text" name="email"/>
                            <span style={{float:"left"}}>@</span>
                            <input  style={{width:"150px" ,float:"left"}} type="text" name="address" />
                            <Input style={{width:"150px" ,float:"left"}} id="domainaddress" type="select" name="domainaddress">
                                <option value="" selected="selected">직접입력</option>
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="daum.net">daum.net</option>
                                <option value="nate.com">nate.com</option>
                            </Input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>파일</th>
                    <td>
                        <div>
                            <input type="file" name="file"/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>문의내용</th>
                    <td>
                        <div>
                            <textarea type="textarea" name="textarea"/>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Button>접수</Button>
        
    </div>
     </div>
    );
  };
  
  export default Ad;
  