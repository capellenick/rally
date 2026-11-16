/**
 * Light haptic tick where the platform supports it. Browsers only allow
 * vibration after the user has interacted with the page, so skip it until then.
 */
export function haptic(pattern: number | number[] = 8) {
  const activated = navigator.userActivation?.hasBeenActive ?? true;
  if (activated && 'vibrate' in navigator) navigator.vibrate(pattern);
}
