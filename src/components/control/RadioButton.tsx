import { Show, type Component } from 'solid-js';
import '../../styles/RadioButton.css';
import { createBooleanControlState, type BooleanControlProps } from './BooleanControl';

export type RadioButtonProps = BooleanControlProps;

const RadioButton: Component<RadioButtonProps> = (props) => {
  const labelMode = () => props.labelMode ?? 'left';
  const [checked, setChecked] = createBooleanControlState(props);

  return (
    <label class='radio-wrapper' title={props.title}>
      <Show when={props.label !== undefined && labelMode() === 'left'}>
        <span class='radio-label'>{props.label}</span>
      </Show>
      <input
        id={props.id}
        class='radio-input'
        type='radio'
        name={props.name}
        checked={checked()}
        onChange={(e) => setChecked(e.currentTarget.checked)}
      />
      <span class='radio-custom'></span>
      <Show when={props.label !== undefined && labelMode() === 'right'}>
        <span class='radio-label'>{props.label}</span>
      </Show>
    </label>
  );
};

export default RadioButton;
