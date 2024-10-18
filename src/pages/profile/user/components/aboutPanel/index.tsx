import { cs } from '@/utils/property'

function AboutPanel() {
  return (
    <div className={cs('w-full', 'rounded-md bg-primary')}>
      <h4 className="p-3 mb-3 border-b border-solid border-primary-b">About</h4>
      <div className={cs('w-full min-h-[250px] p-3')}></div>
    </div>
  )
}

export default AboutPanel
