export function postMessage(message, element = 'main', type = 'error') {
  const parentElement = document.querySelector(element);

  if (type === 'error') {
    const staleErrorMessage = document.querySelector('.error');
    if (!!staleErrorMessage) {
      parentElement.removeChild(staleErrorMessage);
    }

    const newErrorMessage = document.createElement('p');
    newErrorMessage.classList.add('error');
    newErrorMessage.textContent = message;
    parentElement.appendChild(newErrorMessage);
  } else {
    const dialog = document.querySelector('dialog');
    const dialogMessage = document.createElement('p');
    dialogMessage.textContent = message;
    dialog.appendChild(dialogMessage);

    dialog.showModal();

    setTimeout(() => {
      dialog.close();
    }, 2000);
  }
}
