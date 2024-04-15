import React, { FC } from 'react'
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';



export interface CardTotalProp {
  title:string
  total:number
  link:string
  linkTitle:string
  icon:JSX.Element
}

const CardTotal:FC<CardTotalProp> = ({title,link,linkTitle, total,icon}) => {
  return (
    <div className='flex gap-x-3 items-center'>
      <div className='w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full text-rose-600'>
        {icon}
      </div>
      <div className='flex flex-col capitalize'>
        <p className='text-xs font-normal'>{title}</p>
        <p className='text-5xl font-extrabold text-rose-600'>{total}</p>
        <Link href={link} className='flex gap-x-1 items-center text-slate-400 text-[8px] font-normal cursor-pointer'>
          <p className='underline'>{linkTitle}</p>
          <ArrowUpRight className='w-3'/>
        </Link>
      </div>
    </div>
  )
}

export default CardTotal