import { Carousel } from '@arco-design/web-react'
import SlideCover1 from '@/assets/images/login/slide-cover-1.png'
import SlideCover2 from '@/assets/images/login/slide-cover-2.png'
import SlideCover3 from '@/assets/images/login/slide-cover-3.png'
import { cs } from '@/utils/property'
import { LoginBannerProps } from './index.interface'

function LoginBanner(props: LoginBannerProps) {
  const { className } = props

  const carouselList = [
    {
      image: SlideCover1,
      slogan: '占位文本',
      subSlogan:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quasi blanditiis nam enim, laborum odit? Ea enim commodi harum eveniet atque voluptatem?'
    },
    {
      image: SlideCover2,
      slogan: '占位文本二',
      subSlogan:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quasi blanditiis nam enim, laborum odit? Ea enim commodi harum eveniet atque voluptatem?'
    },
    {
      image: SlideCover3,
      slogan: '占位文本三',
      subSlogan:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque quasi blanditiis nam enim, laborum odit? Ea enim commodi harum eveniet atque voluptatem?'
    }
  ]

  return (
    <div className={cs(className, 'flex flex-col items-center justify-center bg-blue-50')}>
      <Carousel
        showArrow="hover"
        indicatorType="line"
        indicatorPosition="outer"
        autoPlay
        style={{ width: '70%' }}
      >
        {carouselList.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center">
            <img src={item.image} style={{ width: '100%' }} />
            <h4 className="w-full mb-2 text-lg font-bold text-center text-primary-l">
              {item.slogan}
            </h4>
            <p className="text-sm font-normal text-center text-light-l">{item.subSlogan}</p>
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default LoginBanner
