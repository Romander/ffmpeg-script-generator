import React from 'react';

import './ScriptVisualizerView.css';

interface IScriptVisualizerViewProps {
    children: React.ReactNode;
}

function ScriptVisualizerView(props: IScriptVisualizerViewProps) {
    const scriptRef = React.useRef<HTMLDivElement>(null);
    const [copied, setCopied] = React.useState<boolean>(false);

    return (
        <div
            className={'script-visualizer-view-container'}
            onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(
                    scriptRef.current?.outerText || ''
                );
            }}
            onMouseLeave={() => setCopied(false)}
            onTouchEnd={() => setCopied(false)}
        >
            <div className={'script-visualizer-view-hover-message'}>
                {copied ? 'Copied!' : 'Copy'}
            </div>
            <div ref={scriptRef} className={'script-visualizer-view'}>
                {props.children}
            </div>
        </div>
    );
}

export { ScriptVisualizerView };
