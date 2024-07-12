export function postMessage(message, type = 'error') {
  const dialog = document.querySelector('dialog');
  const previousDialogMessage = dialog.querySelector('p');

  if (previousDialogMessage) {
    dialog.removeChild(previousDialogMessage);
  }

  const newDialogMessage = document.createElement('p');

  newDialogMessage.textContent = message;
  dialog.appendChild(newDialogMessage);

  dialog.style.borderColor =
    type === 'error' ? 'var(--darker-rose)' : 'var(--green)';

  dialog.showModal();

  setTimeout(() => {
    dialog.close();
  }, 2000);
}
