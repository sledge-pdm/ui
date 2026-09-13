import { createEffect, onCleanup, type Component, type JSX } from 'solid-js';
import '../../styles/ModalDialog.css';
import DialogContent from './DialogContent';

export interface ModalDialogProps {
  open: boolean;
  title?: string;
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
    if (props.open) {
      const active = document.activeElement;
      focusToRestore = active instanceof HTMLElement && active !== document.body ? active : undefined;
      applyInert();
      hostRef?.focus();
    } else {
      releaseInert();
      if (focusToRestore?.isConnected) focusToRestore.focus();
      focusToRestore = undefined;
    }
  });

  onCleanup(releaseInert);

  return (
    <div ref={(el) => (hostRef = el)} class='modal-dialog-host' hidden={!props.open} tabIndex={-1}>
      <DialogContent title={props.title} class={props.class}>
        {props.children}
      </DialogContent>
    </div>
  );
};

export default ModalDialog;
