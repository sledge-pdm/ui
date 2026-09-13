import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import LoadingBar from '../components/LoadingBar';

const meta: Meta<typeof LoadingBar> = {
  title: 'Components/LoadingBar',
  component: LoadingBar,
  decorators: [
    (Story) => (
      <div style={{ width: '240px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoadingBar>;

export const Determinate: Story = {
  render: () => <LoadingBar value={0.4} />,
};

export const Indeterminate: Story = {
  render: () => <LoadingBar />,
};
