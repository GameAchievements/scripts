export const scrollToURLHash = () => {
  if (location.hash?.length > 0) {
    $([document.documentElement, document.body]).animate(
      { scrollTop: $(location.hash).offset().top - 50 },
      2e3
    );
  }
};
