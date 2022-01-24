import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IFFmpegInputParam } from '../../types'

import './AddInputParam.css'

interface IAddInputParamProps {
    onAddInput: (newInput: IFFmpegInputParam | null) => void
}

function AddInputParam(props: IAddInputParamProps) {
    const nameRef = React.useRef<HTMLInputElement>(null)
    const durationRef = React.useRef<HTMLInputElement>(null)

    return (
        <div className="add-input-param">
            <div>
                name:
                <input ref={nameRef} />
            </div>
            <div>
                duration:
                <input ref={durationRef} />
                (seconds, float)
            </div>
            <div>
                <button
                    onClick={() =>
                        props.onAddInput({
                            id: uuidv4(),
                            name: nameRef.current?.value,
                            duration: Number.parseFloat(
                                durationRef.current?.value ?? ''
                            ),
                        })
                    }
                >
                    +
                </button>
            </div>
        </div>
    )
}

export { AddInputParam }
