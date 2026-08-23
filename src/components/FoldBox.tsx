import type { Component, JSX } from 'solid-js';
import '../styles/FoldBox.css';

interface FoldBoxProps {
  defaultOpen?: boolean; // default closed if not specified
  title: string;
  children?: JSX.Element;
}

const FoldBox: Component<FoldBoxProps> = (props) => {
  return (
    <details class='foldbox-root-container' open={props.defaultOpen ?? false}>
      <summary class='foldbox-summary-container'>
        <span class='foldbox-summary-title'>{props.title}</span>
        <span class='foldbox-indicator' aria-hidden='true' />
      </summary>

      <div class='foldbox-content-container'>
        <div class='foldbox-content'>{props.children}</div>
      </div>
    </details>
  );
};

export default FoldBox;
