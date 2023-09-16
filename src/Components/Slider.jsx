import { useState } from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css" // Import the styles
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

export const Slider = ({ images, name }) => {
  const [popupGalleryOpen, setPopupGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openPopupGallery = (index) => {
    setSelectedImageIndex(index)
    setPopupGalleryOpen(true)
  }

  const closePopupGallery = () => {
    setPopupGalleryOpen(false)
  }

  return (
    <>
      <Swiper
        navigation={true}
        effect='coverflow'
        slidesPerView={3}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        onSlideChange={(sliderChange) => console.log(sliderChange)}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <button onClick={() => openPopupGallery(index)}>
              <img src={image} alt={name} />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      {popupGalleryOpen && (
        <div className='absolute inset-0  z-10 flex items-center justify-start bg-black bg-opacity-75'>
          <button
            onClick={closePopupGallery}
            className='mx-8 my-4 bg-white bg-opacity-50 px-4 z-20 absolute top-0 '
          >
            <i
              className='fa fa-close  text-white font-extrabold text-2xl'
              aria-hidden='true'
            ></i>
          </button>
          <div className='relative mx-20 lg:mx-0'>
            <Carousel
              showThumbs={false}
              selectedItem={selectedImageIndex}
              renderIndicator={() => null}
            >
              {images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={name} className='max-h-[37rem]' />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  )
}
