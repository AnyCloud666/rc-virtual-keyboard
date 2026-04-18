import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function PcPushInputIntoViewDemo() {
  const [topValue, setTopValue] = useState('');
  const [bottomValue, setBottomValue] = useState('');

  return (
    <div className="pc-push-demo">
      <div className="pc-push-demo-intro">
        这个页面用于验证 PC 端 fixedBottom 模式下，输入框位于页面底部时，页面是否会自动撑开并把输入框顶回可视区域。
      </div>

      <div className="pc-push-demo-block">
        <div className="basic-usage-label">顶部参考输入框</div>
        <input
          value={topValue}
          placeholder="顶部参考输入框"
          onChange={(e) => setTopValue(e.target.value)}
        />
      </div>

      <div className="pc-push-demo-filler">
        <div className="pc-push-demo-note">
          请继续滚动到页面底部，再聚焦最后一个输入框，观察页面是否会被自动顶起。
        </div>
      </div>

      <div className="pc-push-demo-block pc-push-demo-block-final">
        <div className="basic-usage-label">底部输入框</div>
        <input
          value={bottomValue}
          placeholder="PC 端页面底部输入框"
          onChange={(e) => setBottomValue(e.target.value)}
        />
        <div className="basic-usage-value">
          当前值：{bottomValue || '未输入'}
        </div>
      </div>

      <VirtualKeyboard
        pushInputIntoView
        positionMode="fixedBottom"
      />
    </div>
  );
}
