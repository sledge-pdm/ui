import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import DialogContent from '../../components/dialog/DialogContent';

const meta: Meta<typeof DialogContent> = {
  title: 'Dialog/DialogContent',
  component: DialogContent,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ display: 'grid', 'place-items': 'center', width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

const Body = () => (
  <div style={{ padding: '12px 14px' }}>
    <p>content</p>
  </div>
);

export const None: Story = {
  render: () => (
    <DialogContent>
      <Body />
    </DialogContent>
  ),
};

export const Title: Story = {
  render: () => (
    <DialogContent title='Dialog.'>
      <Body />
    </DialogContent>
  ),
};

export const Close: Story = {
  render: () => (
    <DialogContent onClose={() => {}}>
      <Body />
    </DialogContent>
  ),
};

export const Movable: Story = {
  render: () => (
    <DialogContent movable>
      <Body />
    </DialogContent>
  ),
};

export const TitleAndClose: Story = {
  render: () => (
    <DialogContent title='Dialog.' onClose={() => {}}>
      <Body />
    </DialogContent>
  ),
};

export const TitleAndMovable: Story = {
  render: () => (
    <DialogContent title='Dialog.' movable>
      <Body />
    </DialogContent>
  ),
};

export const CloseAndMovable: Story = {
  render: () => (
    <DialogContent onClose={() => {}} movable>
      <Body />
    </DialogContent>
  ),
};

export const TitleAndCloseAndMovable: Story = {
  render: () => (
    <DialogContent title='Dialog.' onClose={() => {}} movable>
      <Body />
    </DialogContent>
  ),
};
