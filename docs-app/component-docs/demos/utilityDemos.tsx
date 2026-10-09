import { DragBlock } from 'rc-virtual-keyboard';

export function DragBlockDemo() {
  return (
    <div className="component-demo-drag-stage">
      <DragBlock init={{ width: '180px', height: '80px' }} autoKeepRight={false}>
        <div className="component-demo-drag-card">拖动这个浮层</div>
      </DragBlock>
      <div className="component-demo-result">DragBlock 负责拖拽、贴边与定位，不负责内部内容渲染。</div>
    </div>
  );
}
