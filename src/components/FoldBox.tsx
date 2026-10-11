import { Show, type Component, type JSX } from 'solid-js';
import '../styles/FoldBox.css';

interface FoldBoxProps {
  defaultOpen?: boolean; // default closed if not specified
  title?: string;
  titleContent?: JSX.Element; // if titleContent specified, title will be ignored
  children?: JSX.Element;
  noContentPadding?: boolean;
  onToggle?: (opened: boolean) => void;
}

const FoldBox: Component<FoldBoxProps> = (props) => {
  return (
    <details class='foldbox-root-container' open={props.defaultOpen ?? false} onToggle={(e) => props.onToggle?.(e.currentTarget.open)}>
      <summary class='foldbox-summary-container'>
        <Show when={!props.titleContent} fallback={props.titleContent}>
          <span class='foldbox-summary-title'>{props.title}</span>
        </Show>
        <span class='foldbox-indicator' aria-hidden='true' />
      </summary>

      <div class={`foldbox-content-container ${props.noContentPadding && 'foldbox-content-container-nopadding'}`}>
        <div class='foldbox-content'>{props.children}</div>
      </div>
    </details>
  );
};

export default FoldBox;
