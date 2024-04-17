import { Button, Tooltip } from '@arco-design/web-react'
import { IconPlus, IconShareAlt } from '@arco-design/web-react/icon';

function NaviSiderbar() {

    const handleClick = (type: string) => {
        console.log(type)
    }

    return <div className="w-full py-2 flex flex-col items-center gap-2 justify-start">
        <Tooltip content="加好友/群" position="right">
            <Button
                icon={<IconPlus />}
                shape='round'
                onClick={() => handleClick('plus')}
            />
        </Tooltip>
        
        <Tooltip content="分享" position="right">
            <Button
                icon={<IconShareAlt />}
                shape='round'
                onClick={() => handleClick('share')}
            />
        </Tooltip>
    </div>
}

export default NaviSiderbar;