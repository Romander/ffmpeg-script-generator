import { IFFmpegInputParam } from '../../types';
import { ScriptVisualizerView } from './components/ScriptVisualizerView/ScriptVisualizerView';

import './ScriptVisualizer.css';

interface IScriptVisualizerProps {
    enableNvideaDecode: boolean;
    enableNvideaEncode: boolean;
    inputs: IFFmpegInputParam[];
    filterComplexVideosSettings?: string[];
    filterComplexAudiosSettings?: string[];
    xfades?: string[];
    acrossfades?: string[];
    mapping: { [key: string]: string }[];
    outputFilename: string;
    useBackSlash: boolean;
}

const getFilterComplex = (
    useBackSlash: boolean,
    filterComplexVideosSettings?: string[],
    filterComplexAudiosSettings?: string[],
    xfades?: string[],
    acrossfades?: string[]
): string => {
    if (useBackSlash) {
        const separator = useBackSlash ? ' \\ \n' : '';

        return `"${(filterComplexVideosSettings || [])
            .map((item) => `${item}${separator}`)
            .join('')}${(filterComplexAudiosSettings || [])
            .map((item) => `${item}${separator}`)
            .join('')}${
            acrossfades
                ? (xfades || [])
                      .map(
                          (item, index) =>
                              `${item}${
                                  (xfades || []).length - 1 === index &&
                                  acrossfades
                                      ? `;`
                                      : ''
                              }${separator}`
                      )
                      .join('')
                : (xfades || []).join(separator)
        }${(acrossfades || []).join(separator)}"`;
    }

    return `"${(filterComplexVideosSettings || []).join('')}${(
        filterComplexAudiosSettings || []
    ).join('')}${(xfades || []).join('')}${acrossfades && xfades ? `;` : ''}${(
        acrossfades || []
    ).join('')}"`;
};

function ScriptVisualizer(props: IScriptVisualizerProps) {
    const script: { [key: string]: string | undefined }[] = [
        { ffmpeg: undefined },
        { '-vsync': '0' },
        ...(props.enableNvideaDecode ? [{ '-c:v': 'h264_cuvid' }] : []),
        ...props.inputs.map((input) => ({ '-i': input.name })),
        {
            '-filter_complex': getFilterComplex(
                props.useBackSlash,
                props.filterComplexVideosSettings,
                props.filterComplexAudiosSettings,
                props.xfades,
                props.acrossfades
            ),
        },
        ...(props.enableNvideaEncode ? [{ '-c:v': 'h264_nvenc' }] : []),
        ...props.mapping,
        { [props.outputFilename]: undefined },
    ];

    return (
        <ScriptVisualizerView>
            {props.useBackSlash
                ? script.map((value, index) =>
                      Object.keys(value).map((key) => (
                          <div key={index} className="script-visualizer-item">
                              {key} {value[key]}{' '}
                              {script.length - 1 !== index ? '\\' : ''}
                          </div>
                      ))
                  )
                : script
                      .map((value) =>
                          Object.keys(value)
                              .map((key) => `${key} ${value[key] || ''}`)
                              .join(' ')
                      )
                      .join(' ')}
        </ScriptVisualizerView>
    );
}

export { ScriptVisualizer };
