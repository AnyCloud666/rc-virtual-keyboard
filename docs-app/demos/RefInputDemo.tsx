import { useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { Button, Input, InputNumber, Space, Typography } from 'antd';
import type { InputRef } from 'antd';
import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

const { Paragraph, Text } = Typography;

type LogEntry = {
  id: number;
  message: string;
};

type MaybeInputEvent =
  | string
  | FormEvent<HTMLInputElement>
  | {
      currentTarget?: { value?: string | number | null };
      target?: { value?: string | number | null };
    }
  | undefined;

export default function RefInputDemo() {
  const nativeInputRef = useRef<HTMLInputElement | null>(null);
  const antdInputRef = useRef<InputRef>(null);
  const inputNumberRef = useRef<unknown>(null);
  const proFormInputRef = useRef<InputRef>(null);
  const proFormDigitRef = useRef<unknown>(null);
  const nativeValueTextRef = useRef<HTMLSpanElement | null>(null);
  const antdValueTextRef = useRef<HTMLSpanElement | null>(null);
  const inputNumberValueTextRef = useRef<HTMLSpanElement | null>(null);
  const proFormValueTextRef = useRef<HTMLSpanElement | null>(null);
  const proFormDigitValueTextRef = useRef<HTMLSpanElement | null>(null);
  const logIdRef = useRef(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const appendLog = (message: string) => {
    logIdRef.current += 1;
    setLogs((prev) => [{ id: logIdRef.current, message }, ...prev].slice(0, 12));
  };

  const getAntdNativeInput = () => antdInputRef.current?.input ?? null;
  const getProFormNativeInput = () => proFormInputRef.current?.input ?? null;
  const resolveNativeInput = (target: unknown): HTMLInputElement | null => {
    if (!target) return null;

    if (typeof target === 'object') {
      const nativeElement = (target as { nativeElement?: unknown }).nativeElement;
      if (typeof HTMLElement !== 'undefined' && nativeElement instanceof HTMLElement) {
        return nativeElement.tagName === 'INPUT'
          ? (nativeElement as HTMLInputElement)
          : nativeElement.querySelector('input');
      }

      const inputCandidate = (target as { input?: unknown }).input;
      if (typeof HTMLInputElement !== 'undefined' && inputCandidate instanceof HTMLInputElement) {
        return inputCandidate;
      }
    }

    if (typeof HTMLInputElement !== 'undefined' && target instanceof HTMLInputElement) {
      return target;
    }

    if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
      return target.tagName === 'INPUT' ? (target as HTMLInputElement) : target.querySelector('input');
    }

    return null;
  };
  const getInputNumberNativeInput = () => resolveNativeInput(inputNumberRef.current);
  const getProFormDigitNativeInput = () => resolveNativeInput(proFormDigitRef.current);

  const moveCaretToEnd = (input: HTMLInputElement | null, label: string) => {
    if (!input) {
      appendLog(`${label} ref 未拿到真实 input`);
      return;
    }

    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
    appendLog(`${label} ref 聚焦成功，光标已移动到末尾`);
  };

  const selectAll = (input: HTMLInputElement | null, label: string) => {
    if (!input) {
      appendLog(`${label} ref 未拿到真实 input`);
      return;
    }

    input.focus();
    input.select();
    appendLog(`${label} ref 选中了全部内容`);
  };

  const syncValuePreview = (target: HTMLInputElement | null, textRef: RefObject<HTMLSpanElement | null>) => {
    if (!textRef.current) return;
    textRef.current.textContent = target?.value || '未输入';
  };

  const resolveEventValue = (event: MaybeInputEvent, fallbackInput: HTMLInputElement | null) => {
    if (typeof event === 'string') {
      return event;
    }

    const eventValue = event?.currentTarget?.value ?? event?.target?.value;
    if (eventValue !== undefined && eventValue !== null) {
      return String(eventValue);
    }

    return fallbackInput?.value ?? '';
  };

  const handleNativeInput = (e: FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value;
    if (nativeInputRef.current) {
      nativeInputRef.current.value = nextValue;
      syncValuePreview(nativeInputRef.current, nativeValueTextRef);
    }
    appendLog(`原生 input input -> ${nextValue || '(empty)'}`);
  };

  const handleAntdInput = (e: FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value;
    const input = getAntdNativeInput();
    if (input) {
      input.value = nextValue;
      syncValuePreview(input, antdValueTextRef);
    }
    appendLog(`antd Input input -> ${nextValue || '(empty)'}`);
  };

  const handleInputNumberInput = (e: MaybeInputEvent) => {
    const input = getInputNumberNativeInput();
    const nextValue = resolveEventValue(e, input);
    if (input) {
      input.value = nextValue;
      syncValuePreview(input, inputNumberValueTextRef);
    }
    appendLog(`InputNumber input -> ${nextValue || '(empty)'}`);
  };

  const handleProFormInput = (e: FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value;
    const input = getProFormNativeInput();
    if (input) {
      input.value = nextValue;
      syncValuePreview(input, proFormValueTextRef);
    }
    appendLog(`ProFormText input -> ${nextValue || '(empty)'}`);
  };

  const handleProFormDigitInput = (e: MaybeInputEvent) => {
    const input = getProFormDigitNativeInput();
    const nextValue = resolveEventValue(e, input);
    if (input) {
      input.value = nextValue;
      syncValuePreview(input, proFormDigitValueTextRef);
    }
    appendLog(`ProFormDigit input -> ${nextValue || '(empty)'}`);
  };

  return (
    <>
      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <Text strong>原生 input + ref</Text>
          <input
            ref={nativeInputRef}
            placeholder="聚焦这里，使用虚拟键盘输入"
            onFocus={() => appendLog('原生 input focus')}
            onInput={handleNativeInput}
            onChange={(e) => {
              appendLog(`原生 input change -> ${(e.target as HTMLInputElement).value || '(empty)'}`);
            }}
          />
          <Space wrap>
            <Button onClick={() => moveCaretToEnd(nativeInputRef.current, '原生 input')}>
              ref 聚焦到末尾
            </Button>
            <Button onClick={() => selectAll(nativeInputRef.current, '原生 input')}>
              ref 全选
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前值：<span ref={nativeValueTextRef}>未输入</span>
          </Paragraph>
        </div>

        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <Text strong>Ant Design Input + ref</Text>
          <Input
            ref={antdInputRef}
            placeholder="聚焦这里，观察 antd Input 是否正常响应"
            onFocus={() => appendLog('antd Input focus')}
            onInput={handleAntdInput}
            onChange={(e) => {
              appendLog(`antd Input change -> ${e.target.value || '(empty)'}`);
            }}
          />
          <Space wrap>
            <Button onClick={() => moveCaretToEnd(getAntdNativeInput(), 'antd Input')}>
              ref 聚焦到末尾
            </Button>
            <Button onClick={() => selectAll(getAntdNativeInput(), 'antd Input')}>
              ref 全选
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前值：<span ref={antdValueTextRef}>未输入</span>
          </Paragraph>
        </div>

        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <Text strong>Ant Design InputNumber + ref</Text>
          <InputNumber
            ref={inputNumberRef}
            controls={false}
            style={{ width: '100%' }}
            placeholder="聚焦这里，观察 InputNumber 是否正常响应"
            onFocus={() => appendLog('InputNumber focus')}
            onInput={handleInputNumberInput}
            onChange={(value) => {
              appendLog(`InputNumber change -> ${value ?? '(empty)'}`);
            }}
          />
          <Space wrap>
            <Button onClick={() => moveCaretToEnd(getInputNumberNativeInput(), 'InputNumber')}>
              ref 聚焦到末尾
            </Button>
            <Button onClick={() => selectAll(getInputNumberNativeInput(), 'InputNumber')}>
              ref 全选
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前值：<span ref={inputNumberValueTextRef}>未输入</span>
          </Paragraph>
        </div>

        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <Text strong>ProFormText + ref</Text>
          <ProForm
            submitter={false}
            layout="vertical"
            style={{ maxWidth: 720 }}
          >
            <ProFormText
              name="proFormTextDemo"
              label="ProFormText"
              fieldProps={{
                ref: proFormInputRef,
                placeholder: '聚焦这里，观察 ProFormText 是否正常响应',
                onFocus: () => appendLog('ProFormText focus'),
                onInput: handleProFormInput,
                onChange: (e) => {
                  appendLog(`ProFormText change -> ${e.target.value || '(empty)'}`);
                },
              }}
            />
          </ProForm>
          <Space wrap>
            <Button onClick={() => moveCaretToEnd(getProFormNativeInput(), 'ProFormText')}>
              ref 聚焦到末尾
            </Button>
            <Button onClick={() => selectAll(getProFormNativeInput(), 'ProFormText')}>
              ref 全选
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前值：<span ref={proFormValueTextRef}>未输入</span>
          </Paragraph>
        </div>

        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          <Text strong>ProFormDigit + ref</Text>
          <ProForm
            submitter={false}
            layout="vertical"
            style={{ maxWidth: 720 }}
          >
            <ProFormDigit
              name="proFormDigitDemo"
              label="ProFormDigit"
              fieldProps={{
                ref: proFormDigitRef,
                controls: false,
                style: { width: '100%' },
                placeholder: '聚焦这里，观察 ProFormDigit 是否正常响应',
                onFocus: () => appendLog('ProFormDigit focus'),
                onInput: handleProFormDigitInput,
                onChange: (value) => {
                  appendLog(`ProFormDigit change -> ${value ?? '(empty)'}`);
                },
              }}
            />
          </ProForm>
          <Space wrap>
            <Button onClick={() => moveCaretToEnd(getProFormDigitNativeInput(), 'ProFormDigit')}>
              ref 聚焦到末尾
            </Button>
            <Button onClick={() => selectAll(getProFormDigitNativeInput(), 'ProFormDigit')}>
              ref 全选
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            当前值：<span ref={proFormDigitValueTextRef}>未输入</span>
          </Paragraph>
        </div>

        <div
          style={{
            maxWidth: 720,
            border: '1px solid #f0f0f0',
            borderRadius: 12,
            padding: 16,
            background: '#fafafa',
          }}
        >
          <Text strong>最近事件</Text>
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {logs.length > 0 ? logs.map((item) => (
              <div
                key={item.id}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                {item.message}
              </div>
            )) : (
              <Text type="secondary">先点击 ref 按钮或直接输入，观察事件顺序。</Text>
            )}
          </div>
        </div>
      </div>

      <VirtualKeyboard showIcon={false} />
    </>
  );
}
