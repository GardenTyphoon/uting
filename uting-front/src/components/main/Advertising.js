import React, { useEffect, useState } from "react";
import styled from "styled-components";
import defaultAxios from "../../utils/defaultAxios";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import baseurl from "../../utils/baseurl";

const Advertising = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [adslist, setAdslist] = useState([]);

  let getAdlist = async (e) => {
    let data = {
      type: "get",
    };
    const res = await defaultAxios.post("/ads/adslist", data);
    let responseList = [];
    for (let i = 0; i < res.data.length; i++) {
      let response = { src: "", name: "" };
      if (res.data[i].status === "true") {
        response.src = `${baseurl.baseBack}` + res.data[i].file;
        response.name = res.data[i].name;
        responseList.push(response);
      }
    }
    console.log(responseList);
    setAdslist(responseList);
  };

  useEffect(() => {
    getAdlist();
  }, []);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === adslist.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? adslist.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = adslist.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img
          style={{ width: "230px", height: "500px" }}
          src={item.src}
          alt={item.altText}
        />
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators
        items={adslist}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
    </Carousel>
  );
};
export default Advertising;
