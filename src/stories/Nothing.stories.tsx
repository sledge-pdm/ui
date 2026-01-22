import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Nothing from '../components/Nothing';
import { color } from '../theme/vars';

const meta: Meta<typeof Nothing> = {
  title: 'Components/Nothing',
  component: Nothing,
};

export default meta;
type Story = StoryObj<typeof Nothing>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: '300px', border: `1px solid ${color.border}` }}>
      <Nothing>no items.</Nothing>
    </div>
  ),
};
