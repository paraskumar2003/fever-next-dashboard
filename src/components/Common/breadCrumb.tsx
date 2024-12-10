'use client'
import React from 'react'
import { Button } from '../ui/button'
import { FeatureEnabled } from '@/components/featureEnabled/page';


interface buttonEvents {
    onClick?: () => void;
    name?: string;
    buttonText?: string;
    symbolIcon?: string | React.ReactNode;
}

export default function BreadCrumb({ onClick, name, symbolIcon, buttonText }: buttonEvents) {

    return (
        <>
            <span className='flex justify-between items-center bg-white px-2 mb-2 py-1 shadow-md rounded-[5px]'>
                <h1 className='text-gray-600 sm:text-sm md:text-md lg:text-lg font-semibold p-1'>{name}</h1>
                <FeatureEnabled featureFlag='ADD_BUTTON'>
                    <Button onClick={onClick} className='bg-orange-600 hover:bg-orange-700 font-bold'><span className='font-semibold'>{symbolIcon}</span> {buttonText} </Button>
                </FeatureEnabled>
            </span>
        </>
    )
}
