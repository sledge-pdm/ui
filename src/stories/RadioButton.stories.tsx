import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import RadioButton from '../components/control/RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Control/RadioButton',
  component: RadioButton,
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = createSignal<'a' | 'b'>('a');
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <RadioButton name='radio-group' label='Option A' checked={selected() === 'a'} onChange={(checked) => checked && setSelected('a')} />
        <RadioButton name='radio-group' label='Option B' checked={selected() === 'b'} onChange={(checked) => checked && setSelected('b')} />
      </div>
    );
  },
};

export const GroupLabelRight: Story = {
  render: () => {
    const [selected, setSelected] = createSignal<'a' | 'b'>('a');
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <RadioButton
          name='radio-group'
          labelMode='right'
          label='Option A'
          checked={selected() === 'a'}
          onChange={(checked) => checked && setSelected('a')}
        />
        <RadioButton
          name='radio-group'
          labelMode='right'
          label='Option B'
          checked={selected() === 'b'}
          onChange={(checked) => checked && setSelected('b')}
        />
      </div>
    );
  },
};

export const Standalone: Story = {
  play: ({ canvasElement }) => {
    const input = canvasElement.querySelector('.radio-input');
    if (!(input instanceof HTMLInputElement)) throw new Error('RadioButton input was not rendered');

    input.click();
    if (!input.checked) throw new Error('Uncontrolled RadioButton did not retain its checked state');
  },
};
