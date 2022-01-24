import { IFFmpegInputParam } from '../../types';
import { ScriptVisualizerView } from './components/ScriptVisualizerView/ScriptVisualizerView';

interface IScriptVisualizerProps {
    enableNvideaDecode: boolean;
    enableNvideaEncode: boolean;
    inputs: Array<IFFmpegInputParam>;
    filterComplexVideosSettings?: Array<string>;
    filterComplexAudiosSettings?: Array<string>;
    xfades?: Array<string>;
    acrossfades?: Array<string>;
    mapping: string;
    outputFilename: string;
}

function ScriptVisualizer(props: IScriptVisualizerProps) {
    return (
        <ScriptVisualizerView>
            <div>ffmpeg \</div>
            <div>-vsync 0 \</div>
            {props.enableNvideaDecode && <div>-c:v h264_cuvid \</div>}
            {props.inputs.map((input, index) => (
                <div key={index}>-i "{input.name}" \</div>
            ))}
            <div>
                -filter_complex \
                {props.filterComplexVideosSettings?.map((setting, index) => (
                    <div key={index}>
                        {index === 0 ? '"' : null}
                        {setting} \
                    </div>
                ))}
                {props.filterComplexAudiosSettings?.map((setting, index) => (
                    <div key={index}>{setting} \</div>
                ))}
            </div>
            <div>
                {props.xfades?.map((xfade, index) => (
                    <div key={index}>
                        {xfade}
                        {props.xfades?.length &&
                        index === props.xfades?.length - 1
                            ? props.acrossfades
                                ? ';'
                                : '"'
                            : null}
                        \
                    </div>
                ))}
                {props.acrossfades?.map((acrossfade, index) => (
                    <div key={index}>
                        {acrossfade}
                        {props.acrossfades?.length &&
                        index === props.acrossfades?.length - 1
                            ? '"'
                            : null}
                        \
                    </div>
                ))}
            </div>
            {props.enableNvideaEncode && <div>-c:v h264_nvenc \</div>}
            <div>-b:v 10M \</div>
            <div>
                {props.mapping} "{props.outputFilename}" \
            </div>
        </ScriptVisualizerView>
    );
}

export { ScriptVisualizer };
