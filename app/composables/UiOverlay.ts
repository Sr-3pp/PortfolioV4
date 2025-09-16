export const useUiOverlay = (key: string) => {
  
  const open = useState<boolean>(`overlay:${key}:open`, () => false);

  const openOverlay = () => {
    open.value = true;
  };
  const closeOverlay = () => {
    open.value = false;
  };
  const toggleOverlay = () => {
    open.value = !open.value;
  };

  return {
    open,
    openOverlay,
    closeOverlay,
    toggleOverlay,
  }
}
