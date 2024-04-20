import type { HTMLAttributes } from 'react';

export interface BaseProps extends HTMLAttributes<HTMLElement> {
    members: User.UserEntity[]
}