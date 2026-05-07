import { VKB_CONFIG } from '../keys';
import { VKB } from '../typing';

const DEFAULT_VKB_CONFIG: VKB.StoredConfig = {
  themeMode: 'light',
  positionMode: 'float',
  width: '500px',
  height: '320px',
  fontSize: '14px',
  fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
  useKeydownAudio: 'Y',
  numberKeyboardLayoutMode: 'asc',
  usePinyinLearning: 'Y',
};

const parseStoredConfig = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<VKB.StoredConfig>;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const normalizeVkbConfig = (
  config?: Partial<VKB.StoredConfig>,
): VKB.StoredConfig => {
  const sanitizedConfig = Object.fromEntries(
    Object.entries(config ?? {}).filter(([, value]) => value !== undefined),
  ) as Partial<VKB.StoredConfig>;

  return {
    ...DEFAULT_VKB_CONFIG,
    ...sanitizedConfig,
  };
};

export const getStoredVkbConfig = (
  defaults?: Partial<VKB.StoredConfig>,
): VKB.StoredConfig => {
  if (typeof window === 'undefined') {
    return normalizeVkbConfig(defaults);
  }

  const storage = window.localStorage;
  const storedConfig = parseStoredConfig(storage.getItem(VKB_CONFIG));

  return normalizeVkbConfig({
    ...storedConfig,
    ...defaults,
  });
};

export const saveStoredVkbConfig = (config: VKB.StoredConfig) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(VKB_CONFIG, JSON.stringify(config));
};
