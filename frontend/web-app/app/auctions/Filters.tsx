import { useParamStore } from '@/hooks/useParamStore'
import { Button, ButtonGroup } from 'flowbite-react'
import { set } from 'mermaid/dist/diagrams/state/id-cache.js'
import React from 'react'

const pageSizeButtons = [4, 8, 12]

export default function Filters() {
    const pageSize = useParamStore(state => state.pageSize)
    const setParams = useParamStore(state => state.setParams)

    return (
    <div className='flex justify-between items-center mb-4'>
        <div>
            <span className='upparcase text-sm text-gray-500 mr-2'>Page size:</span>
            <ButtonGroup>
                {pageSizeButtons.map((value, i) => (
                    <Button key={i}
                        onClick={() => setParams({pageSize: value})}
                        color={`${pageSize === value ? 'red' : 'gray'}`}
                        className='focus:ring-0'
                    >
                        {value}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    </div>
    )
}
