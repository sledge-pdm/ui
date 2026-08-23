import { Show, type Component } from 'solid-js';
import '../../styles/Checkbox.css';
import { createBooleanControlState, type BooleanControlProps } from './BooleanControl';

export type CheckboxProps = BooleanControlProps & {
  inputRef?: (el: HTMLInputElement) => void;
};

const Checkbox: Component<CheckboxProps> = (props) => {
  const labelMode = () => props.labelMode ?? 'right';
  const [checked, setChecked] = createBooleanControlState(props);

  return (
    <label class='checkbox-wrapper' title={props.title}>
      <Show when={props.label !== undefined && labelMode() === 'left'}>
        <span class='checkbox-label'>{props.label}</span>
      </Show>
      <input
        id={props.id}
        class='checkbox-input'
        name={props.name}
        type='checkbox'
        checked={checked()}
        onChange={(e) => setChecked(e.currentTarget.checked)}
        ref={props.inputRef}
      />
      <span class='checkbox-custom' />
      <Show when={props.label !== undefined && labelMode() === 'right'}>
        <span class='checkbox-label'>{props.label}</span>
      </Show>
    </label>
  );
};

export default Checkbox;
