import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CollegeRankingContainer = styled.div`
  margin-top: 10px;
  background: white;
  width: 20vw;
  min-width: 180px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
`;
const CollegeContainer = styled.div`
  color: black;
  font-family: NanumSquare_acR;
  border-radius: 10px;
  width: 16vw;
  min-width: 155px;
  max-width: 180px;
  padding: 5px;
  margin: 5px;
  text-align: center;
  font-weight: 500;
`;
const CollegeRanking = () => {
  const collegeTop10 = ["아주대학교", "서울대학교", "연세대학교"];
  const rankingColor = ["#FF9D93", "#FFADA4", "#FBBCB5", "FFFEFE"];
  return (
    <CollegeRankingContainer>
      {collegeTop10.map((college, index) => (
        <CollegeContainer style={{ backgroundColor: rankingColor[index] }}>
          {index + 1}.{college}
        </CollegeContainer>
      ))}
    </CollegeRankingContainer>
  );
};
export default CollegeRanking;
