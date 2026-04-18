import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function MobilePushInputIntoViewDemo() {
  const [topValue, setTopValue] = useState('');
  const [middleValue, setMiddleValue] = useState('');
  const [bottomValue, setBottomValue] = useState('');
  const [finalBottomValue, setFinalBottomValue] = useState('');

  return (
    <div className="mobile-push-demo">
      <div className="mobile-push-demo-intro">
        这个页面特意拉长了内容区域，请在移动端浏览器里聚焦最下方输入框，观察固定底部键盘是否会把输入框顶回可视区域。
      </div>

      <div className="mobile-push-demo-block">
        <div className="basic-usage-label">顶部输入框</div>
        <input
          value={topValue}
          placeholder="顶部输入框"
          onChange={(e) => setTopValue(e.target.value)}
        />
      </div>

      <div className="mobile-push-demo-filler">
        <div className="mobile-push-demo-note">向下滚动，继续测试中段与底部输入框。</div>
      </div>

      <div className="mobile-push-demo-block">
        <div className="basic-usage-label">中段输入框</div>
        <input
          value={middleValue}
          placeholder="中段输入框"
          onChange={(e) => setMiddleValue(e.target.value)}
        />
      </div>

      <div className="mobile-push-demo-filler mobile-push-demo-filler-large">
        <div className="mobile-push-demo-note">
          继续下滑到页面底部，再聚焦最后一个输入框。
        </div>
      </div>

      <div className="mobile-push-demo-block mobile-push-demo-block-bottom">
        <div className="basic-usage-label">底部输入框</div>
        <input
          value={bottomValue}
          placeholder="底部输入框，最适合验证移动端顶起能力"
          onChange={(e) => setBottomValue(e.target.value)}
        />
        <div className="basic-usage-value">
          当前值：{bottomValue || '未输入'}
        </div>
      </div>

      <div className="mobile-push-demo-block mobile-push-demo-block-final">
        <div className="basic-usage-label">最底部输入框</div>
        <input
          value={finalBottomValue}
          placeholder="页面最底部输入框"
          onChange={(e) => setFinalBottomValue(e.target.value)}
        />
        <div className="basic-usage-value">
          当前值：{finalBottomValue || '未输入'}
        </div>
      </div>

      <VirtualKeyboard
        pushInputIntoView
        positionMode="fixedBottom"
      />
    </div>
  );
}
