export function postErrorMessage(message, main) {
  const staleErrorMessage = document.querySelector('.error');
  if (!!staleErrorMessage) {
    main.removeChild(staleErrorMessage);
  }

  const newErrorMessage = document.createElement('p');
  newErrorMessage.classList.add('error');
  newErrorMessage.textContent = message;
  main.appendChild(newErrorMessage);
}
