import { createEffect, onCleanup, type Component, type JSX } from 'solid-js';
import '../styles/ModalDialog.css';

export interface ModalDialogProps {
  open: boolean;
  /** 制限をかける範囲。省略時はこのダイアログを置いた親要素。position: static 以外であること */
  scope?: HTMLElement | (() => HTMLElement | undefined);
  class?: string;
  children: JSX.Element;
}

/**
 * @description Modal dialog restricted to one container. Dims its scope and makes the contents inert,
 *   leaving everything outside the scope live for the caller to disable.
 */
const ModalDialog: Component<ModalDialogProps> = (props) => {
  let hostRef: HTMLDivElement | undefined;
  let dialogRef: HTMLDialogElement | undefined;
  let focusToRestore: HTMLElement | undefined;
  let inerted: HTMLElement[] = [];

  const resolveScope = (): HTMLElement | undefined => {
    const scope = typeof props.scope === 'function' ? props.scope() : props.scope;
    return scope ?? hostRef?.parentElement ?? undefined;
  };

  // inert は子孫に継承されるため、scope 自体ではなくダイアログを含まない子だけに付ける
  const applyInert = () => {
    const scope = resolveScope();
    if (!scope) return;

    for (const child of Array.from(scope.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (hostRef && (child === hostRef || child.contains(hostRef))) continue;
      if (child.hasAttribute('inert')) continue;
      child.setAttribute('inert', '');
      inerted.push(child);
    }
  };

  const releaseInert = () => {
    for (const element of inerted) element.removeAttribute('inert');
    inerted = [];
  };

  createEffect(() => {
    const open = props.open;
    if (!dialogRef) return;

    if (open && !dialogRef.open) {
      const active = document.activeElement;
      focusToRestore = active instanceof HTMLElement && active !== document.body ? active : undefined;
      applyInert();
      // showModal はトップレイヤーへ昇格して viewport 全体を覆い、document 全体を inert にする
      dialogRef.show();
      dialogRef.focus();
    } else if (!open && dialogRef.open) {
      dialogRef.close();
      releaseInert();
      if (focusToRestore?.isConnected) focusToRestore.focus();
      focusToRestore = undefined;
    }
  });

  onCleanup(() => {
    releaseInert();
    if (dialogRef?.open) dialogRef.close();
  });

  return (
    <div ref={(el) => (hostRef = el)} class='modal-dialog-host' hidden={!props.open}>
      <dialog ref={(el) => (dialogRef = el)} class={['modal-dialog', props.class].filter(Boolean).join(' ')} tabIndex={-1}>
        {props.children}
      </dialog>
    </div>
  );
};

export default ModalDialog;
