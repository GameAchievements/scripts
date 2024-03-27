import { setupPagination } from './setupPagination';

export function mutationTarget(elemId, fetchFn, pageBreakpoint) {
  const targetNodes = $('.gas-list-total-pages-info');
  const MutationObserver = window.MutationObserver;
  const myObserver = new MutationObserver(mutationHandler);

  targetNodes.each(function () {
    myObserver.observe(this, {
      childList: true,
    });
  });

  function mutationHandler(mutationRecords) {
    for (const mutation of mutationRecords) {
      if (mutation.addedNodes.length > 0) {
        const pages = Number(mutation.addedNodes[0].data);
        setupPagination({
          elemId: `${elemId}-pagination`,
          fetchFn,
          pageBreakpoint,
          totalPages: pages,
        });
      }
    }
  }
}
