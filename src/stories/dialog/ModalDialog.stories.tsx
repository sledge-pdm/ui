import { createSignal, onCleanup } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Button from '../../components/Button';
import FoldBox from '../../components/FoldBox';
import ModalDialog from '../../components/dialog/ModalDialog';

const meta: Meta<typeof ModalDialog> = {
  title: 'Dialog/ModalDialog',
  component: ModalDialog,
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

const LOADING_MS = 3000;

const useLoading = () => {
  const [loading, setLoading] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => clearTimeout(timer));

  return {
    loading,
    start: () => {
      setLoading(true);
      clearTimeout(timer);
      timer = setTimeout(() => setLoading(false), LOADING_MS);
    },
  };
};

const Loading = () => (
  <div style={{ padding: '16px 20px' }}>
    <p>loading...</p>
  </div>
);

export const Normal: Story = {
  render: () => {
    const { loading, start } = useLoading();
    return (
      <div style={{ position: 'fixed', inset: '0', padding: '16px' }}>
        <Button onClick={start}>Start loading</Button>
        <ModalDialog open={loading()}>
          <Loading />
        </ModalDialog>
      </div>
    );
  },
};

export const InContainer: Story = {
  render: () => {
    const { loading, start } = useLoading();
    return (
      <div style={{ display: 'flex', 'flex-direction': 'column', gap: '12px', width: '400px' }}>
        <Button onClick={start}>Start loading</Button>

        <FoldBox title='container.' noContentPadding defaultOpen>
          <div
            style={{
              position: 'relative',
              height: '160px',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
            }}
          >
            <Button>Push</Button>
            <ModalDialog open={loading()}>
              <Loading />
            </ModalDialog>
          </div>
        </FoldBox>
      </div>
    );
  },
};
