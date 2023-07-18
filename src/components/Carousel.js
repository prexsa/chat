import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap';

function NoTransitionCarousel({ activeIndex, images }) {
  const [index, setIndex] = useState(0)
  // console.log('activeIndex: ', activeIndex)
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  useEffect(() => {
    setIndex(activeIndex)
  }, [activeIndex])
// console.log('images: ', images)
  return (
    <Carousel 
      interval={null}
      activeIndex={index} 
      slide={false} 
      onSelect={handleSelect}
      indicators={false}
    >
      {
        images && images.map((image, imgIndex) => {
          // console.log('image: ', image)
          return (
            <Carousel.Item key={imgIndex}>
              <img
                className="modal-image" 
                src={image.content} 
                alt="" 
              />
              {/*<Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>*/}
            </Carousel.Item>
          )
        })
      }
    </Carousel>
  );
}

export default NoTransitionCarousel;