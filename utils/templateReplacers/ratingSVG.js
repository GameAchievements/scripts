function ratingColor(rate) {
  switch (rate) {
    case 1:
      return '#FF6C6C';
    case 2:
      return '#FF876C';
    case 3:
      return '#FFB36C';
    case 4:
      return '#FFD66C';
    case 5:
      return '#D0FF6C';
    case 6:
      return '#6CFFCA';
    case 7:
      return '#69E4FF';
    case 8:
      return '#99A3FF';
    case 9:
      return '#C699FF';
    case 10:
      return '#FFA0EA';
    default:
      return '#5663BA';
  }
}

function controllerSVG(svgProps = '') {
  return `<svg ${svgProps} viewBox="0 0 400 283" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M396.063 200.058C387.286 177.198 388.232 171.375 363.69 113.777C342.879 64.745 324.486 39.1518 302.256 32.5827V16.449C302.256 7.35738 294.899 0 285.807 0H260.74C251.648 0 244.291 7.35738 244.291 16.449V30.7959H155.687V16.449C155.687 7.35738 148.277 0 139.238 0H114.17C105.079 0 97.7212 7.35738 97.7212 16.449V32.5827C75.4388 39.1518 57.098 64.745 36.2345 113.777C11.6925 171.427 12.5859 177.25 3.80958 200.058C-4.91416 222.919 0.341103 257.656 30.0859 275.104C59.8833 292.499 89.6806 279.36 114.17 246.568C138.712 213.775 148.329 215.414 169.35 215.414H230.679C251.701 215.414 261.265 213.775 285.807 246.568C310.297 279.36 340.094 292.446 369.891 275.104C399.636 257.709 404.944 222.919 396.168 200.058H396.063Z" />
    </svg>`;
}

function rateMark() {
  $('svg', this).css('fill', ratingColor(Number($(this).data('rate'))));
  $('p', this).show();
}
function rateReset() {
  $('svg', this).css('fill', '#5663BA');
  $('p', this).hide();
}

export function ratingScale($rateEl, $rateTxtEl) {
  for (let rate = 1; rate < 11; rate++) {
    $rateEl.append(
      `<li data-rate="${rate}" role="button"><p>${rate}</p>${controllerSVG()}</li>`
    );
  }
  $('li', $rateEl).click(function () {
    $(this).siblings().removeClass('rating-active');
    $(this).addClass('rating-active');
    const rating = Number($(this).data('rate'));
    $rateTxtEl
      .data('rate', rating)
      .text(`${rating}/10`)
      .css('color', ratingColor(rating));
  });

  $('li', $rateEl).on('mouseenter', function () {
    rateMark.apply(this);
    $(this).nextAll().each(rateReset);
    $(this).prevAll().each(rateMark);
  });

  $('li', $rateEl).on('mouseleave', () => {
    const $active = $('.rating-active', $rateEl);
    if (!$active.length) {
      $('li', $rateEl).each(rateReset);
    } else {
      rateMark.apply($active);
      $active.prevAll().each(rateMark);
      $active.nextAll().each(rateReset);
    }
  });
}

export function ratingSVG(rate) {
  return controllerSVG(`class="bg-review-score" fill="${ratingColor(rate)}"`);
}
