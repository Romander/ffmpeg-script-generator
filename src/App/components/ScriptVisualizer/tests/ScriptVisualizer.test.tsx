import * as uuid from 'uuid';
import renderer from 'react-test-renderer';
import { ScriptVisualizer } from '../ScriptVisualizer';

const getProps = (newProps?: any) => ({
    enableNvideaDecode: false,
    enableNvideaEncode: false,
    inputs: [
        { id: uuid.v4(), name: 'F1.AVI', duration: 10 },
        { id: uuid.v4(), name: 'F2.AVI', duration: 10 },
    ],
    filterComplexVideosSettings: ['[0]settb=AVTB[0:v];', '[1]settb=AVTB[1:v];'],
    filterComplexAudiosSettings: ['[0]atrim=0:10[0:a];', '[1]atrim=0:10[1:a];'],
    xfades: [
        '[0:v][1:v]xfade=transition=fade:duration=1:offset=9,format=yuv420p[video]',
    ],
    acrossfades: ['[0:a][1:a]acrossfade=d=1:c1=tri:c2=tri[audio]'],
    mapping: '-map "[audio]" -map "[video]"',
    outputFilename: 'out.mp4',
    ...newProps,
});

test('ScriptVisualizer should render correctly', () => {
    const component = renderer.create(<ScriptVisualizer {...getProps()} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('ScriptVisualizer should render with enableNvideaDecode setting', () => {
    const component = renderer.create(
        <ScriptVisualizer {...getProps({ enableNvideaDecode: true })} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('ScriptVisualizer should render with enableNvideaEncode setting', () => {
    const component = renderer.create(
        <ScriptVisualizer {...getProps({ enableNvideaEncode: true })} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('ScriptVisualizer should render with enableNvideaDecode and enableNvideaEncode setting', () => {
    const component = renderer.create(
        <ScriptVisualizer
            {...getProps({
                enableNvideaDecode: true,
                enableNvideaEncode: true,
            })}
        />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('ScriptVisualizer should render without acrossfades', () => {
    const component = renderer.create(
        <ScriptVisualizer {...getProps({ acrossfades: null })} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
