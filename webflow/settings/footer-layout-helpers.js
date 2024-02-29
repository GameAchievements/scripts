// ~~~ Layout helpers ~~~
const gaDate = (isoDate) => {
  const pad = (v) => `0${v}`.slice(-2);
  const dateObj = new Date(isoDate);
  return `${dateObj.getFullYear()} . ${pad(dateObj.getMonth() + 1)} . ${pad(
    dateObj.getDate()
  )}`;
};
const gaTime = (isoDate) => {
  const pad = (v) => `0${v}`.slice(-2);
  const dateObj = new Date(isoDate);

  return `${pad(dateObj.getHours())}h${pad(dateObj.getMinutes())}`;
};
const gaDateTime = (isoDate) => {
  const dateObj = new Date(isoDate);
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date =
    dateObj.getDate() +
    ' ' +
    month[dateObj.getMonth()] +
    ', ' +
    dateObj.getFullYear();
  const time = dateObj.toLocaleTimeString().toLowerCase();
  return { date, time };
};

const platformNameIdMap = (platformName) => {
  switch (platformName) {
    case 'playstation':
      return 1;
    case 'xbox':
      return 2;
    case 'steam':
    default:
      return 3;
  }
};

const rarityClassCalc = (percent) => {
  if (percent < 25) {
    return 'common';
  } else if (percent < 50) {
    return 'rare';
  } else if (percent < 75) {
    return 'very-rare';
  } else if (percent >= 75) {
    return 'ultra-rare';
  }
};

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
function ratingSVG(rate) {
  return controllerSVG(`class="bg-review-score" fill="${ratingColor(rate)}"`);
}
function rateMark() {
  $('svg', this).css('fill', ratingColor(Number($(this).data('rate'))));
  $('p', this).show();
}
function rateReset() {
  $('svg', this).css('fill', '#5663BA');
  $('p', this).hide();
}
function ratingScale($rateEl, $rateTxtEl) {
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

  $('li', $rateEl).on('mouseleave', function () {
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
// usage:
// ratingScale($(".gas-rating-scale"), $(".gas-rating-selected"));

// on gas-form edition, prevent page navigation/close
let isUserInputActive = false;
$(window).on('beforeunload', (evt) => {
  if (isUserInputActive) {
    // Cancel the event as stated by the standard
    evt.preventDefault();
    // Chrome requires returnValue to be set
    return (evt.returnValue = '');
  }
  return (evt.returnValue = undefined);
});
$('.gas-form').on('input', (evt) => {
  // any input containing text will prompt the user before leaving
  isUserInputActive = false;
  for (const inField of $('input:not([type=submit]),textarea', '.gas-form')) {
    const fieldVal = $(inField).val();
    if (fieldVal.length) {
      isUserInputActive = true;
      break;
    }
  }
});
const achievementNameSlicer = (name) => {
  // while achievements names have metadata (e.g. platform ids) for distinguishing purposes
  // this helps to take out that data
  if (!name) {
    return 'N.A.';
  }
  const metaDivider = name.lastIndexOf(' | ');
  return metaDivider > 0 ? name.slice(0, metaDivider) : name;
};
const setupListSearch = (elemId, fetchFn) => {
  $(`${elemId} form.search`).on('submit', async function (evt) {
    evt.preventDefault();
    searchTerm = new URLSearchParams($(this).serialize()).get('query');
    if (searchTerm?.length) {
      $('.ga-loader-container', elemId).show();
      $('.gas-list,.gas-list-results-info', elemId).hide();
      await fetchFn(elemId, searchTerm);
      $('.gas-list-results-info', elemId).show();
      $('.ga-loader-container').hide();
    }
  });
};
const scrollToURLHash = () => {
  if (location.hash?.length > 0) {
    $([document.documentElement, document.body]).animate(
      { scrollTop: $(location.hash).offset().top - 50 },
      2e3
    );
  }
};
const displayMessage = (
  $msgEl,
  msgText,
  type = 'success',
  posAction = () => {}
) => {
  $msgEl.addClass(`${type}-message`).css('display', 'flex');
  $('div:first-child', $msgEl).text(msgText);
  setTimeout(() => {
    $msgEl.removeClass(`${type}-message`).hide();
    posAction();
  }, formMessageDelay);
};
const isSteamImage = (imgURL) =>
  imgURL?.includes('steamstatic') || imgURL?.includes('steampowered');
const isXboxEdsImage = (imgURL) => imgURL?.includes('images-eds.xboxlive.com');

// ~~~ template replacers/managers ~~~
const showPlatform = (
  platformName,
  dataTemplateActual,
  parentSelector = '.gas-list-entry'
) => {
  const platformVerifier = {
    ps: { rgx: /playstation/gi },
    xbox: { rgx: /xbox/gi },
    steam: { rgx: /steam|pc|windows|mac|linux/gi },
  };
  if (platformVerifier.ps.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-psn`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.steam.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-steam`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  if (platformVerifier.xbox.rgx.test(platformName)) {
    dataTemplateActual = $(`.gas-platform-xbox`, dataTemplateActual)
      .css('display', 'inherit')
      .parents(parentSelector)
      .prop('outerHTML');
  }
  return dataTemplateActual;
};

const showRarityTag = (percentageNumber, dataTemplateActual) => {
  const classValue = rarityClassCalc(percentageNumber);
  dataTemplateActual = dataTemplateActual.replaceAll(
    `{|rarity|}`,
    classValue.replace('-', ' ')
  );
  dataTemplateActual = $(`.gas-rarity-tag`, dataTemplateActual)
    .removeClass('gas-rarity-tag')
    .addClass(`gas-rarity-tag-${classValue}`)
    .children('.p1')
    .addClass(classValue)
    .parents('.gas-list-entry')
    .prop('outerHTML');
  return dataTemplateActual;
};

const showRarityTagAchievement = (
  percentageNumber,
  dataTemplateActual,
  parent = '.hero-section-achievement'
) => {
  const classValue = rarityClassCalc(percentageNumber);

  dataTemplateActual = $(`.rarity-tag-wrapper`, dataTemplateActual)
    .children(`:not(.gas-rarity-tag-${classValue})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};

const showTrophy = (trophyType, dataTemplateActual, parent = '.gh-row') => {
  dataTemplateActual = $(`.trophy-wrapper`, dataTemplateActual)
    .children(`:not(.trophy-${trophyType.toLowerCase()})`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};

const showAchievementUnlocked = (
  userProgress,
  dataTemplateActual,
  parent = '.gh-row'
) => {
  const unlocked = userProgress?.unlocked;
  if (unlocked) {
    dataTemplateActual = dataTemplateActual.replaceAll(
      `{|unlockedAt|}`,
      `${gaTime(userProgress.unlockedAt)}<br />${gaDate(
        userProgress.unlockedAt
      )}`
    );
  }

  dataTemplateActual = $(`.status-wrapper`, dataTemplateActual)
    .children(`:not(.${unlocked ? 'unlocked' : 'locked'}-status)`)
    .hide()
    .parents(parent)
    .prop('outerHTML');

  return dataTemplateActual;
};

// NOTE: if the parent element is corrupted (not found), undefined is returned
const showImageFromSrc = ($img, url, parentSelector = '.gas-list-entry') =>
  $img
    .removeAttr('srcset')
    .removeAttr('sizes')
    .attr('src', url)
    .parents(parentSelector)
    .prop('outerHTML');

// replaces standard double quotes by curvy ou single quotes to avoid elements attributes closing — since param can be a number (id), return it
const cleanupDoubleQuotes = (content) =>
  content?.length
    ? content
        .replace(/"(\w)/g, '“$1')
        .replace(/(\w)"/g, '$1”')
        .replaceAll('"', "'")
    : content;

const listTemplateAppend = (
  $list,
  dataTemplateActual,
  itemIdx,
  unlocked = false
) => {
  $list
    .append(dataTemplateActual)
    .children()
    .last()
    .removeClass(['bg-light', 'bg-dark', 'locked', 'unlocked'])
    .addClass(`bg-${itemIdx % 2 > 0 ? 'light' : 'dark'}`)
    .addClass(`${unlocked ? 'unlocked' : 'locked'}`);
};
