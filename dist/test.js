(() => {
  // utils/pagination/generateNumbersArr.js
  var maxAround = 1;
  var maxRange = 5;
  var maxElements = 7;
  function generateNumbersArr(totalPages, currentPage) {
    const endRange = totalPages - maxRange + 1;
    const inStartRange = currentPage <= maxRange - 1;
    const inEndRange = currentPage >= endRange + 1;
    if (totalPages <= maxElements)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (inStartRange) {
      return [
        ...Array.from({ length: maxRange }, (_, i) => i + 1),
        "ellipsis",
        totalPages
      ];
    }
    if (inEndRange) {
      return [
        1,
        "ellipsis",
        ...Array.from({ length: maxRange }, (_, i) => totalPages - i).sort()
      ];
    }
    return [
      1,
      "ellipsis",
      ...Array.from(
        { length: maxRange - 2 },
        (_, i) => currentPage - maxAround + i
      ),
      "ellipsis",
      totalPages
    ];
  }

  // utils/pagination/RenderPageBtn.js
  function renderPageBtn(elemId, totalPages, currentPage = 1) {
    $(".gas-filters-sw-li.btn-page", $(elemId)).remove();
    $(".btn-ellipsis", $(elemId)).remove();
    const $templateBtn = $(".gas-filters-sw-li.duplicate-btn", $(elemId));
    if (totalPages === 1) {
      $("#btn-page-next").addClass("disabled");
    }
    const pageNumbersArr = generateNumbersArr(totalPages, currentPage);
    for (const element of pageNumbersArr) {
      if (element === "ellipsis") {
        addEllipsisBtn();
      } else {
        addPageBtn($templateBtn, element);
      }
    }
  }
  function addPageBtn($entryElem, index, disabled, insert = { place: "before", elementId: "#btn-page-next" }) {
    const $pageBtn = $entryElem.clone();
    $pageBtn.text(index).removeClass("duplicate-btn").addClass(`btn-page ${disabled ?? ""}`).attr("id", `btn-page-${index}`);
    if (insert.place === "before") {
      $pageBtn.insertBefore(insert.elementId);
    } else {
      $pageBtn.insertAfter(insert.elementId);
    }
  }
  function addEllipsisBtn(insert = { place: "before", elementId: "#btn-page-next" }) {
    const $ellipsis = $('<span class="btn-ellipsis">...</span>');
    if (insert.place === "before") {
      $ellipsis.insertBefore(insert.elementId);
    } else {
      $ellipsis.insertAfter(insert.elementId);
    }
  }

  // webflow/test.js
  console.log("first", renderPageBtn("asd", 15));
})();
