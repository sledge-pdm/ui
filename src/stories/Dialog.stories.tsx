import { createSignal, Show } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from '../components/Button';
import Dialog from '../components/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
  render: () => (
    <Dialog title='Dialog'>
      <div style={{ padding: '8px' }}>
        <p>Content goes here.</p>
      </div>
    </Dialog>
  ),
};

export const WithClose: Story = {
  render: () => {
    const [open, setOpen] = createSignal(true);
    return (
      <div>
        <Show when={!open()}>
          <Button onClick={() => setOpen(true)}>Reopen</Button>
        </Show>
        <Show when={open()}>
          <Dialog title='Dialog' onClose={() => setOpen(false)}>
            <div style={{ padding: '8px' }}>
              <p>Click × to close.</p>
            </div>
          </Dialog>
        </Show>
      </div>
    );
  },
};

export const Modal: Story = {
  render: () => {
    const [open, setOpen] = createSignal(true);
    return (
      <div>
        <Show when={!open()}>
          <Button onClick={() => setOpen(true)}>Reopen</Button>
        </Show>
        <Show when={open()}>
          <Dialog title='Modal Dialog' modal onClose={() => setOpen(false)}>
            <div style={{ padding: '8px' }}>
              <p>Backdrop blocks interaction behind this dialog.</p>
            </div>
          </Dialog>
        </Show>
      </div>
    );
  },
};

export const NoTitle: Story = {
  render: () => (
    <Dialog>
      <div style={{ padding: '8px' }}>
        <p>No title bar text.</p>
      </div>
    </Dialog>
  ),
};
