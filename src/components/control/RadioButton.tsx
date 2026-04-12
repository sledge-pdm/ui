import { Show, type Component } from 'solid-js';
import '../../styles/RadioButton.css';
import type { LabelMode } from '../../types';

const RadioButton: Component<{
  id?: string;
  name?: string;
  label?: string;
  labelMode?: LabelMode;
  value?: boolean;
  title?: string;
  onChange?: (checked: boolean) => void;
}> = (props) => {
  const labelMode = props.labelMode ?? 'left';
  return (
    <label class='radio-wrapper' title={props.title}>
      <Show when={labelMode === 'left'}>{props.label}</Show>
      <input
        id={props.id}
        class='radio-input'
        type='radio'
        name={props.name}
        checked={props.value}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
      <span class='radio-custom'></span>
      <Show when={labelMode === 'right'}>{props.label}</Show>
    </label>
  );
};

export default RadioButton;
