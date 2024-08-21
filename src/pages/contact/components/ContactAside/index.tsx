import { useContext } from 'react'
import { Collapse } from '@arco-design/web-react'
import { IconInfoCircle, IconSettings } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { ContactContext } from '../../index'
import { ContactItemEnum } from '../../index.interface'

function ContactAside() {
  const { menu, setMenu } = useContext(ContactContext)

  return (
    <div className={cs('w-[280px] h-full p-3 bg-primary', 'border border-r border-r-solid border-primary-b')}>
      <Collapse activeKey={menu} bordered={false} expandIconPosition="right">
        <Collapse.Item
          header="Beijing Toutiao Technology Co., Ltd."
          name={ContactItemEnum.ALL_PEOPLE}
          extra={<IconInfoCircle />}
        >
          Beijing Toutiao Technology Co., Ltd.
        </Collapse.Item>

        <Collapse.Item header="Introduce" name={ContactItemEnum.FAVORITE} extra={<IconSettings />}>
          ByteDance's core product, Toutiao ('Headlines'), is a content platform in China and around
          the world. Toutiao started out as a news recommendation engine and gradually evolved into
          a platform delivering content in various formats, such as texts, images,
          question-and-answer posts, microblogs, and videos.
        </Collapse.Item>

        <Collapse.Item header="The Underlying AI Technology" name={ContactItemEnum.TAGS}>
          In 2016, ByteDance's AI Lab and Peking University co-developed Xiaomingbot (张小明), an
          artificial intelligence bot that writes news articles. The bot published 450 articles
          during the 15-day 2016 Summer Olympics in Rio de Janeiro. In general, Xiaomingbot
          published stories approximately two seconds after the event ended.
        </Collapse.Item>

        <Collapse.Item header="The Underlying AI Technology" name={ContactItemEnum.EVENTS}>
          In 2016, ByteDance's AI Lab and Peking University co-developed Xiaomingbot (张小明), an
          artificial intelligence bot that writes news articles. The bot published 450 articles
          during the 15-day 2016 Summer Olympics in Rio de Janeiro. In general, Xiaomingbot
          published stories approximately two seconds after the event ended.
        </Collapse.Item>
      </Collapse>
    </div>
  )
}

export default ContactAside
