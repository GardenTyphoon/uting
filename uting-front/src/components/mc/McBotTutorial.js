import React, {useState} from "react";
import {Carousel,CarouselItem,CarouselControl,CarouselIndicators,CarouselCaption} from "reactstrap";

const McBotTutorial = () =>{
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const items = [
        {
          src:"/img/mcBotDescript1.png",
          altText: '',
          caption: ''
        },
        {
          src:"/img/mcBotDescript2.png",
          altText: '',
          caption: ''
        },
        {
          src: "/img/mcBotDescript3.png",
          altText: '',
          caption: ''
        },
        {
          src: "/img/mcBotDescript4.png",
          altText: '',
          caption: ''
        },
        {
          src: "/img/mcBotDescript5.png",
          altText: '',
          caption: ''
        }
      ];
    
     
    
      const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
      }
    
      const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
      }
    
      const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
      }
    
      const slides = items.map((item) => {
        return (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.src}
          >
            <img style={{width:"760px"}} src={item.src} alt={item.altText} />
            <CarouselCaption captionText={item.caption} captionHeader={item.altText} />
          </CarouselItem>
        );
      });
    return (
        <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
    );
}

export default McBotTutorial;