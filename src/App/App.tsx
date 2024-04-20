import React from 'react';
import { AddInputParam } from './components/AddInputParam/AddInputParam';
import { Checkbox } from './components/Checkbox/Checkbox';
import { EditInputParam } from './components/EditInputParam/EditInputParam';
import { Input } from './components/Input/Input';
import { ScriptVisualizerView } from './components/ScriptVisualizer/components/ScriptVisualizerView/ScriptVisualizerView';
import { ScriptVisualizer } from './components/ScriptVisualizer/ScriptVisualizer';
import { IFFmpegInputParam } from './types';

import './App.css';

function App() {
    const [enableNvideaDecode, setEnableNvideaDecode] =
        React.useState<boolean>(false);
    const [enableNvideaEncode, setEnableNvideaEncode] =
        React.useState<boolean>(false);
    const [isScriptGeneratingSeparately, setIsScriptGeneratingSeparately] =
        React.useState<boolean>(false);
    const [useBackSlash, setUseBackSlash] = React.useState<boolean>(true);

    const [transition, setTransition] = React.useState<number>(1);
    const [inputs, setInputs] = React.useState<Array<IFFmpegInputParam>>([]);
    const [outputFilename, setOutputFilename] =
        React.useState<string>('out.mp4');

    const handleAddInput = React.useCallback(
        (newInput: IFFmpegInputParam | null) => {
            if (newInput) {
                setInputs((oldInputs) => [...oldInputs, newInput]);
            }
        },
        []
    );

    const handleDeleteInput = React.useCallback((id: string | null) => {
        if (id) {
            setInputs((oldInputs) =>
                oldInputs.filter((input) => input.id !== id)
            );
        }
    }, []);

    const handleChangeInput = React.useCallback(
        (newInput: IFFmpegInputParam | null) => {
            if (newInput) {
                setInputs((oldInputs) => {
                    return oldInputs.map((input) =>
                        input.id === newInput.id ? newInput : input
                    );
                });
            }
        },
        []
    );

    const handleChangeTransition = React.useCallback(
        (newTransition: string | null) => {
            if (newTransition && Number.parseFloat(newTransition)) {
                setTransition(Number.parseFloat(newTransition));
            }
        },
        []
    );

    const handleChangeOutputFilename = React.useCallback(
        (newFilename: string | null) => {
            if (newFilename) {
                setOutputFilename(newFilename);
            }
        },
        []
    );

    const handleChangeNvideaDecodeCheckbox = React.useCallback(() => {
        setEnableNvideaDecode((value) => !value);
    }, []);

    const handleChangeNvideaEncodeCheckbox = React.useCallback(() => {
        setEnableNvideaEncode((value) => !value);
    }, []);

    const handleChangeIsScriptGeneratingSeparately = React.useCallback(() => {
        setIsScriptGeneratingSeparately((value) => !value);
    }, []);

    const handleUseBackSlash = React.useCallback(() => {
        setUseBackSlash((value) => !value);
    }, []);

    const getScript = (
        transitionDurationSec: number
    ): {
        filterComplexVideosSettings: Array<string>;
        filterComplexAudiosSettings: Array<string>;
        xfades: Array<string>;
        acrossfades: Array<string>;
    } => {
        var priveousOffset = 0;
        var filterComplexVideosSettings: Array<string> = [];
        var filterComplexAudiosSettings: Array<string> = [];
        var xfades: Array<string> = [];
        var acrossfades: Array<string> = [];
        for (var i = 0; i < inputs.length; i++) {
            filterComplexAudiosSettings = [
                ...filterComplexAudiosSettings,
                getFilterComplexAudioSetting(i, inputs[i].duration ?? 0),
            ];

            filterComplexVideosSettings = [
                ...filterComplexVideosSettings,
                getFilterComplexVideoSetting(i),
            ];

            if (i < inputs.length - 1) {
                acrossfades = [
                    ...acrossfades,
                    getAcrossfade(i, inputs.length, transitionDurationSec),
                ];

                const offset = +(
                    (inputs[i].duration ?? 0) +
                    priveousOffset -
                    transitionDurationSec
                );

                priveousOffset = offset;

                xfades = [
                    ...xfades,
                    getXfade(i, inputs.length, offset, transitionDurationSec),
                ];
            }
        }

        return {
            filterComplexVideosSettings,
            filterComplexAudiosSettings,
            xfades,
            acrossfades,
        };
    };

    const getXfade = (
        i: number,
        lastIndex: number,
        offset: number,
        transitionDurationSec: number
    ): string =>
        `${i === 0 ? `[${i}:v]` : `[v${i}]`}[${
            i + 1
        }:v]xfade=transition=fade:duration=${transitionDurationSec}:offset=${offset}${
            i + 1 === lastIndex - 1 ? ',format=yuv420p[video]' : `[v${i + 1}];`
        }`;

    const getFilterComplexVideoSetting = (i: number) =>
        `[${i}]settb=AVTB[${i}:v];`;

    const getAcrossfade = (
        i: number,
        lastIndex: number,
        transitionDurationSec: number
    ) =>
        `${i === 0 ? `[${i}:a]` : `[a${i}]`}[${
            i + 1
        }:a]acrossfade=d=${transitionDurationSec}:c1=tri:c2=tri${
            i + 1 === lastIndex - 1 ? '[audio]' : `[a${i + 1}];`
        }`;

    const getFilterComplexAudioSetting = (i: number, durationSec: number) =>
        `[${i}]aresample=async=1:first_pts=0,apad,atrim=0:${durationSec}[${i}:a];`;

    const script = getScript(transition);

    return (
        <div className="app">
            <div className="layout">
                <div className="title">Generate FFmpeg script</div>
                <div className="title-message">
                    Generator FFmpeg CLI command for concatenation several
                    videos into single one using filter complex xfade and
                    acrossfade.
                </div>

                <div className="group-title">Add inputs</div>
                <div className="inputs-container">
                    <div className="text">
                        Input files will be generated into the format -i "name"
                        in result script, duration should be specified to
                        generate correct xfade offset and atrim for audio.
                    </div>
                    <AddInputParam onAddInput={handleAddInput} />
                    {inputs.map((input) => (
                        <EditInputParam
                            key={input.id}
                            inputParam={input}
                            onChangeInput={handleChangeInput}
                            onDeleteInput={handleDeleteInput}
                        />
                    ))}
                </div>

                <div className="group-title">Modify params</div>
                <div className="params-container">
                    <div className="text">
                        Change duration and output filename.
                    </div>
                    <Input
                        type="number"
                        placeholder="Transition duration (seconds, float)"
                        value={transition.toString()}
                        title="Transition duration (seconds, float)"
                        onChange={handleChangeTransition}
                    />
                    <Input
                        type="text"
                        placeholder="Output filename"
                        value={outputFilename}
                        title="Output filename"
                        onChange={handleChangeOutputFilename}
                    />
                </div>

                <div className="group-title">Check some features</div>
                <div className="checkboxes-container">
                    <div className="text">
                        If your ffmepg has nvidea feature it would be better
                        turned on this checkboxes (Enable nvidea decoder, Enable
                        nvidea encoder) for the performance boost. "Generate
                        audio and video scripts separately" if you have a lot of
                        videos I recommend to use separate generation video and
                        audio because of better performance.
                    </div>
                    <Checkbox
                        title={'Enable nvidea decoder (using gpu)'}
                        onChange={handleChangeNvideaDecodeCheckbox}
                    />
                    <Checkbox
                        title={'Enable nvidea encoder (using gpu)'}
                        onChange={handleChangeNvideaEncodeCheckbox}
                    />
                    <Checkbox
                        title={
                            'Generate audio and video scripts separately? (separate scripts more effective)'
                        }
                        onChange={handleChangeIsScriptGeneratingSeparately}
                    />
                    <Checkbox
                        value={useBackSlash}
                        title={'Use back slash (\\)'}
                        onChange={handleUseBackSlash}
                    />
                </div>

                {isScriptGeneratingSeparately ? (
                    <>
                        <ScriptVisualizer
                            enableNvideaDecode={enableNvideaDecode}
                            enableNvideaEncode={enableNvideaEncode}
                            inputs={inputs}
                            filterComplexVideosSettings={
                                script.filterComplexVideosSettings
                            }
                            xfades={script.xfades}
                            mapping={[{ '-map': '"[video]"', '-rc': 'vbr', '-cq': '30', '-qmin': '30', '-qmax': '30' }]}
                            outputFilename={'temp.mp4'}
                            useBackSlash={useBackSlash}
                        />

                        <ScriptVisualizer
                            enableNvideaDecode={enableNvideaDecode}
                            enableNvideaEncode={enableNvideaEncode}
                            inputs={inputs}
                            filterComplexAudiosSettings={
                                script.filterComplexAudiosSettings
                            }
                            acrossfades={script.acrossfades}
                            mapping={[{ '-map': '"[audio]"', '-ar': '48000', '-b:a': '96k' }]}
                            outputFilename={'temp.wav'}
                            useBackSlash={useBackSlash}
                        />

                        <ScriptVisualizerView>
                            ffmpeg -i "temp.mp4" -i "temp.wav" -c:v copy -c:a
                            aac {outputFilename}
                        </ScriptVisualizerView>
                    </>
                ) : (
                    <ScriptVisualizer
                        enableNvideaDecode={enableNvideaDecode}
                        enableNvideaEncode={enableNvideaEncode}
                        inputs={inputs}
                        filterComplexVideosSettings={
                            script.filterComplexVideosSettings
                        }
                        filterComplexAudiosSettings={
                            script.filterComplexAudiosSettings
                        }
                        xfades={script.xfades}
                        acrossfades={script.acrossfades}
                        mapping={[
                            { '-map': '"[audio]"' , '-ar': '48000', '-b:a': '96k' },
                            { '-map': '"[video]"', '-rc': 'vbr', '-cq': '30', '-qmin': '30', '-qmax': '30' },
                        ]}
                        outputFilename={outputFilename}
                        useBackSlash={useBackSlash}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
