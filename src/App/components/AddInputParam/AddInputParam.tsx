import React from 'react';
import * as uuid from 'uuid';
import { IFFmpegInputParam } from '../../types';

import './AddInputParam.css';

interface IAddInputParamProps {
    onAddInput: (newInput: IFFmpegInputParam | null) => void;
}

function AddInputParam(props: IAddInputParamProps) {
    const [name, setName] = React.useState<string | null>(null);
    const [duration, setDuration] = React.useState<number | null>(null);

    const handleAdd = React.useCallback(() => {
        if (name && duration) {
            props.onAddInput({
                id: uuid.v4(),
                name,
                duration,
            });
            setName(null);
            setDuration(null);
        } else {
            alert('name and duration are required');
        }
    }, [name, duration, props]);

    return (
        <div className="add-input-param">
            <div>
                name:
                <input
                    value={name || ''}
                    placeholder="name"
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div>
                duration:
                <input
                    type="number"
                    value={duration || ''}
                    placeholder="duration"
                    onChange={(event) =>
                        setDuration(Number(event.target.value))
                    }
                />
                (seconds, float)
            </div>
            <div>
                <button onClick={handleAdd}>+</button>
            </div>
        </div>
    );
}

export { AddInputParam };
