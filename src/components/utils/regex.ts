export function validateInput(event: KeyboardEvent, regex: RegExp | undefined) {
  if (!regex) return;

  if (
    !regex.test(event.key) &&
    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
      event.key
    )
  ) {
    event.preventDefault();
  }
}
