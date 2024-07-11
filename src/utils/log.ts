/**
 * 带样式的日志输出
 *
 * @export
 * @param {({
 *   type: 'info' | 'warning' | 'error' | 'success';
 *   message: string;
 * })} {
 *   type = 'info',
 *   message,
 * }
 */
export function log({
  type = 'info',
  message,
}: {
  type: 'info' | 'warning' | 'error' | 'success';
  message: any;
}) {
  let background = '#1677ff';
  if (type === 'warning') {
    background = '#ff8f1f';
  } else if (type === 'error') {
    background = '#ff3141';
  } else if (type === 'success') {
    background = '#00b578';
  }
  console.info(`%c ${message} `, `background: ${background}; color: #ffffff`);
}
