export function animate(onStart: Function, minDuration: number) : () => Promise<void> {
  let minDurationDone = false;
  let asyncActionDone = false;
  let resolver: Function;

  const stopAnimation = () => {
    asyncActionDone = true;
    if (minDurationDone) {
      resolver();
    }
  };

  const promise: Promise<void> = new Promise(resolve => {
    resolver = resolve;

    setTimeout(() => {
      if (!asyncActionDone) {
        onStart && onStart();
        setTimeout(() => {
          minDurationDone = true;
          if (asyncActionDone) {
            resolver();
          }
        }, minDuration);
      } else {
        resolver();
      }
    }, 0);
  });

  return () => (stopAnimation(), promise);
}
