import React from 'react';
//Home icon
import {AiTwotoneHome as HomeIcon} from 'react-icons/ai'
//Food icon
import {MdFastfood as FoodIcon} from 'react-icons/md'
//Link icon
import {AiOutlineLink as LinkIcon} from 'react-icons/ai'
//Post icon
import {BiSolidPhotoAlbum as PostIcon} from 'react-icons/bi'

//参考
//https://www.gaji.jp/blog/2022/07/11/10379/

const icons = {HomeIcon, FoodIcon, LinkIcon, PostIcon}

type Name = keyof typeof icons

type Props = {
    name: Name
    size?: number
    className?: string
}

export function Icon({ name, size, className}: Props) {
    const IconComponent = icons[name]

    return (
        <IconComponent
            style={{ marginLeft: 4, marginTop: 3, marginBottom: 0, paddingBottom: 0 ,width: 30, height: 30  }}
            className={className}
        />
    )
}

