import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Slider from '../components/control/Slider';

const meta: Meta<typeof Slider> = {
  title: 'Control/Slider',
  component: Slider,
  args: {
    labelMode: 'left',
  },
  argTypes: {
    labelMode: {
      options: ['left', 'none', 'right'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Horizontal: Story = {
  render: (args) => {
    const [value, setValue] = createSignal(35);
    return (
      <div style={{ width: '200px' }}>
        <Slider
          {...args}
          min={0}
          max={100}
          value={value()}
          onChange={setValue}
          orientation='horizontal'
          allowDirectInput
          wheelSpin
          dblClickResetValue={50}
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  render: (args) => {
    const [value, setValue] = createSignal(60);
    return (
      <div style={{ width: 'fit-content', height: '200px' }}>
        <Slider
          {...args}
          min={0}
          max={100}
          value={value()}
          onChange={setValue}
          orientation='vertical'
          allowDirectInput
          wheelSpin
          dblClickResetValue={50}
        />
      </div>
    );
  },
};
