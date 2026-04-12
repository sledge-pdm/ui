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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          'flex-direction': 'column',
          width: '100%',
          height: '100%',
          'align-items': 'center',
          'justify-content': 'center',
          'background-color': 'var(--color-on-background)',
        }}
      >
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

export const WithCloseSemiTransparent: Story = {
  render: () => {
    const [open, setOpen] = createSignal(true);
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          'flex-direction': 'column',
          width: '100%',
          height: '100%',
          'align-items': 'center',
          'justify-content': 'center',
          'background-color': 'var(--color-on-background)',
        }}
      >
        <Show when={!open()}>
          <Button onClick={() => setOpen(true)}>Reopen</Button>
        </Show>
        <Show when={open()}>
          <Dialog title='Dialog' backgroundOpacity={0.4} onClose={() => setOpen(false)}>
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
