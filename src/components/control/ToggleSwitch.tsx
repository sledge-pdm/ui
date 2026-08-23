import { Show, type Component } from 'solid-js';
import '../../styles/ToggleSwitch.css';
import { createBooleanControlState, type BooleanControlProps } from './BooleanControl';

export type ToggleSwitchProps = BooleanControlProps;

const ToggleSwitch: Component<ToggleSwitchProps> = (props) => {
  const labelMode = () => props.labelMode ?? 'left';
  const [checked, setChecked] = createBooleanControlState(props);

  return (
    <label class='toggle-wrapper' title={props.title}>
      <Show when={props.label !== undefined && labelMode() === 'left'}>
        <span class='toggle-label'>{props.label}</span>
      </Show>
      <input
        id={props.id}
        type='checkbox'
        name={props.name}
        checked={checked()}
        onChange={(e) => setChecked(e.currentTarget.checked)}
        class='toggle-input'
      />
      <span class='toggle-track'>
        <span class='toggle-thumb' />
      </span>
      <Show when={props.label !== undefined && labelMode() === 'right'}>
        <span class='toggle-label'>{props.label}</span>
      </Show>
    </label>
  );
};

export default ToggleSwitch;
