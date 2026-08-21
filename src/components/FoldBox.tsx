import { createSignal, Show, type Component, type JSX } from 'solid-js';
import '../styles/FoldBox.css';

interface FoldBoxProps {
  defaultOpen?: boolean; // default closed if not specified
  title: string;
  children?: JSX.Element;
}

const FoldBox: Component<FoldBoxProps> = (props) => {
  const [open, setOpen] = createSignal<boolean>(props.defaultOpen ?? false);

  return (
    <div class='foldbox-root-container'>
      <div class='foldbox-summary-container' aria-checked={open()} onClick={() => setOpen(!open())}>
        <p class='foldbox-summary-title'>{props.title}</p>
        <span class='foldbox-indicator' aria-hidden='true' style={{ rotate: open() ? '180deg' : '' }} />
      </div>

      <Show when={open()}>
        <div class='foldbox-content-container' aria-checked={open()}>
          <div class='foldbox-content'>{props.children}</div>
        </div>
      </Show>
    </div>
  );
};

export default FoldBox;
