import type { LabelMode } from '../types';

export type ConfigComponentName = 'Dropdown' | 'Slider' | 'CheckBox' | 'RadioButton' | 'ToggleSwitch' | 'Custom';

export type ConfigComponentProps = {
  labelByComponent: boolean;
  labelMode: LabelMode;
};

// Default behaviors for how each control handles labels.
export const componentProps = new Map<ConfigComponentName, ConfigComponentProps>([
  [
    'Dropdown',
    {
      labelByComponent: false,
      labelMode: 'none',
    },
  ],
  [
    'Slider',
    {
      labelByComponent: true,
      labelMode: 'left',
    },
  ],
  [
    'CheckBox',
    {
      labelByComponent: true,
      labelMode: 'right',
    },
  ],
  [
    'RadioButton',
    {
      labelByComponent: true,
      labelMode: 'right',
    },
  ],
  [
    'ToggleSwitch',
    {
      labelByComponent: true,
      labelMode: 'right',
    },
  ],
  [
    'Custom',
    {
      labelByComponent: true,
      labelMode: 'none',
    },
  ],
]);
