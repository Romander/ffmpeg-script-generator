import React from 'react'

import './ScriptVisualizerView.css'

interface IScriptVisualizerViewProps {
    children: React.ReactNode
}

function ScriptVisualizerView(props: IScriptVisualizerViewProps) {
    return <div className={'script-visualizer-view'}>{props.children}</div>
}

export { ScriptVisualizerView }
