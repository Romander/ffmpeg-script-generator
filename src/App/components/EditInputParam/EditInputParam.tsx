import React from 'react'
import { IFFmpegInputParam } from '../../types'

import './EditInputParam.css'

interface IEditnputParamProps {
    inputParam: IFFmpegInputParam
    onChangeInput: (updatedValue: IFFmpegInputParam | null) => void
    onDeleteInput: (deletedValue: string | null) => void
}

function EditInputParam(props: IEditnputParamProps) {
    const { onChangeInput, onDeleteInput } = props

    const handleChangeNameInput = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeInput({
                ...props.inputParam,
                name: event.target.value,
            } as IFFmpegInputParam)
        },
        [onChangeInput, props.inputParam]
    )

    const handleChangeDurationInput = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeInput({
                ...props.inputParam,
                duration: Number.parseFloat(event.target.value),
            } as IFFmpegInputParam)
        },
        [props.inputParam, onChangeInput]
    )

    const handleDeleteInput = React.useCallback(() => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Are you sure?')) {
            onDeleteInput(props.inputParam?.id ?? null)
        }
    }, [props.inputParam, onDeleteInput])

    return (
        <div className="edit-input-param">
            <div>
                name:
                <input
                    placeholder="name"
                    value={props.inputParam?.name}
                    onChange={handleChangeNameInput}
                />
            </div>
            <div>
                duration:
                <input
                    type="number"
                    placeholder="duration"
                    value={props.inputParam?.duration}
                    onChange={handleChangeDurationInput}
                />
                (seconds, float)
            </div>
            <div>
                <button onClick={handleDeleteInput}>-</button>
            </div>
        </div>
    )
}

export { EditInputParam }
