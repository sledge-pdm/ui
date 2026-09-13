import { Show, type Component } from 'solid-js';
import '../styles/LoadingBar.css';

export interface LoadingBarProps {
  /** 0〜1 の進捗。省略すると進捗不明として帯が流れ続ける */
  value?: number;
  class?: string;
}

/**
 * @description Progress bar. Fills to `value`, or runs a sliding band when the progress is unknown.
 */
const LoadingBar: Component<LoadingBarProps> = (props) => {
  const ratio = () => (props.value === undefined ? undefined : Math.max(0, Math.min(1, props.value)));

  return (
    <div class={['loading-bar-track', props.class].filter(Boolean).join(' ')}>
      <Show when={ratio() !== undefined} fallback={<div class='loading-bar-indeterminate' />}>
        <div class='loading-bar-fill' style={{ width: `${(ratio() ?? 0) * 100}%` }} />
      </Show>
    </div>
  );
};

export default LoadingBar;
