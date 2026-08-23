import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ToggleSwitch from '../components/control/ToggleSwitch';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Control/ToggleSwitch',
  component: ToggleSwitch,
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Basic: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(true);
    return <ToggleSwitch checked={checked()} label='Enable' onChange={setChecked} />;
  },
};

export const LabelRight: Story = {
  render: () => {
    const [checked, setChecked] = createSignal(false);
    return <ToggleSwitch checked={checked()} label='Right label' labelMode='right' onChange={setChecked} />;
  },
};

export const Standalone: Story = {
  play: ({ canvasElement }) => {
    const input = canvasElement.querySelector('.toggle-input');
    if (!(input instanceof HTMLInputElement)) throw new Error('ToggleSwitch input was not rendered');

    input.click();
    if (!input.checked) throw new Error('Uncontrolled ToggleSwitch did not retain its checked state');
  },
};
