import type { Component } from 'solid-js';
import '../styles/Nothing.css';

interface NothingProps {
  children: string;
}

/**
 * @description Component to show something is missing or not available. [ {text} ]
 */
const Nothing: Component<NothingProps> = (props) => {
  return (
    <div class={'nothing-container'}>
      <p class={'nothing-text'}>{props.children}</p>
    </div>
  );
};

export default Nothing;
