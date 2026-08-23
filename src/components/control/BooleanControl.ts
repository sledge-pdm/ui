import { createSignal, type Accessor, type JSX } from 'solid-js';
import type { LabelMode } from '../../types';

export type BooleanControlProps = {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: JSX.Element;
  labelMode?: LabelMode;
  title?: string;
  onChange?: (checked: boolean) => void;
};

export const createBooleanControlState = (
  props: Pick<BooleanControlProps, 'checked' | 'defaultChecked' | 'onChange'>
): readonly [Accessor<boolean>, (checked: boolean) => void] => {
  const [uncontrolledChecked, setUncontrolledChecked] = createSignal(props.defaultChecked ?? false);

  const checked = () => props.checked ?? uncontrolledChecked();
  const setChecked = (nextChecked: boolean) => {
    if (props.checked === undefined) {
      setUncontrolledChecked(nextChecked);
    }
    props.onChange?.(nextChecked);
  };

  return [checked, setChecked] as const;
};
