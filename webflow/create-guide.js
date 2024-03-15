//currently using guide-form

import { gaDate, achievementNameSlicer } from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(window.location.search);
const guideId = Number(urlParams.get('id')) || 0;
const isEditing = guideId > 0;
let guideFetchedData;
let achievementId = Number(urlParams.get('achievementId')) || 0;
const elemId = '#gas-guide-form';
let sectionsCount = 2;
const $sectionTemp = $('.gas-form-section', elemId).last().clone();
$('.ga-loader-container').show(), $('#ga-sections-container').hide();
const isRequiredFilled = (e, t) => !!t && ((isUserInputActive = !0), !0);
const highlightRequiredLabel = (e) => {
  if (
    (e.hasClass('gas-form-tinymce')
      ? tinyMCE.get(e.attr('id')).getContent()
      : e.val()
    )?.length
  )
    return e.prev('label').removeClass('field-label-missing');
  e.prev('label').addClass('field-label-missing');
};
const canSubmit = (e) => {
  let t = !1;
  let i = !1;
  e?.length && highlightRequiredLabel(e);
  for (const e of $('input[name][required]', elemId))
    if (((t = isRequiredFilled($(e), $(e).val()?.length)), !t)) break;
  for (const e of $('.gas-form-tinymce', elemId))
    if (
      ((i = isRequiredFilled(
        $(e),
        tinyMCE.get($(e).attr('id')).getContent()?.length
      )),
      !i)
    )
      break;
  t && i
    ? $(`${elemId}-btn-submit`)
        .removeClass('disabled-button')
        .attr('disabled', !1)
    : $(`${elemId}-btn-submit`)
        .addClass('disabled-button')
        .attr('disabled', !0);
};
let editorChangeHandlerId;
const tmceObj = {
  selector: '.gas-form-tinymce',
  height: 200,
  menubar: !1,
  toolbar_mode: 'floating',
  plugins: 'link image lists',
  toolbar: 'undo redo | bold italic underline | numlist bullist',
  content_style: 'body { font-family:Gantari,sans-serif; font-size:1rem }',
  setup: (e) => {
    e.on('Paste Change input Undo Redo', () => {
      clearTimeout(editorChangeHandlerId),
        (editorChangeHandlerId = setTimeout(
          () => canSubmit($(e.targetElm)),
          100
        ));
    });
  },
};
function delSection() {
  if (confirm('Do you want to remove this section?')) {
    canSubmit();
    const e = $(this).parents('.gas-form-section');
    tinyMCE.get($('.gas-form-tinymce', e).attr('id')).remove(),
      e.remove(),
      sectionsCount--,
      $('.gas-form-section label[for$=-title]', elemId).each((e, t) =>
        $(t).text(`${e + 1}${$(t).text().slice(1)}`)
      ),
      sectionsCount <= 4 && $('.gas-form-section-add', elemId).show();
  }
}
async function addSection() {
  sectionsCount++,
    $(`${elemId}-btn-submit`).addClass('disabled-button').attr('disabled', !0);
  const e = $sectionTemp.clone().show(),
    t = `section-${sectionsCount}`;
  $('label[for=section-2-title]', e)
    .text(`${sectionsCount} › section name*`)
    .attr('for', `${t}-title`),
    $('[name=section-2-title]', e)
      .attr('name', `${t}-title`)
      .on('focusout keyup', function () {
        canSubmit($(this));
      }),
    $('label[for=section-2-content]', e).attr('for', `${t}-content`);
  const i = `${t}-content`;
  $('.gas-form-tinymce', e).attr('id', i).attr('name', i).attr('data-name', i),
    $('.gas-form-section-del', e).on('click', delSection),
    $('.gas-form-sections', elemId).append(e),
    (tmceObj.selector = `#${i}`),
    await tinymce.init(tmceObj),
    sectionsCount > 4 && $('.gas-form-section-add', elemId).hide();
}
async function setupForm() {
  $('.gas-form-tinymce', $sectionTemp).removeAttr('id'),
    await tinymce.init(tmceObj),
    isEditing &&
      guideFetchedData?.id === guideId &&
      ($('[name=guide-title]', elemId).val(guideFetchedData.name),
      $('[name=guide-description]', elemId).val(guideFetchedData.description),
      guideFetchedData.sections.forEach(async (e, t) => {
        t > 1 && t < guideFetchedData.sections.length && (await addSection()),
          $(`[name=section-${t + 1}-title]`).val(e.title),
          tinyMCE.get(`section-${t + 1}-content`).setContent(e.content);
      })),
    $('.gas-form-section-add', elemId).on('click', addSection),
    $('.gas-form-section-del', elemId).on('click', delSection),
    $(`${elemId}-btn-cancel`, elemId).on('click', (e) => {
      e.preventDefault();
      const t = $('#gas-popup-leave-confirmation');
      t.css({ opacity: 1, display: 'flex' }),
        $('.gas-popup-btn-close', t).one('click', (e) => {
          e.preventDefault(), t.hide();
        }),
        $('.gas-popup-btn-leave', t).one('click', (e) => {
          e.preventDefault(),
            (isUserInputActive = !1),
            t.hide(),
            redirectAway();
        });
    }),
    $(`${elemId}-btn-submit`).attr('disabled', !0);
  const e = $(`${elemId}-btn-submit`).val(),
    t = $('.gas-form-error', elemId),
    i = $('div', t),
    a = t.text(),
    n = $('.gas-form-success', elemId);
  $('input[name][required]', elemId).on('focusout keyup', function () {
    canSubmit($(this));
  }),
    $(`${elemId}-btn-submit`).on('click', async (s) => {
      s.preventDefault(),
        $(`${elemId}-btn-submit`)
          .addClass('disabled-button')
          .attr('disabled', !0),
        (isUserInputActive = !1),
        $(`${elemId}-btn-submit`).val($(`${elemId}-btn-submit`).data('wait'));
      let d = [];
      $('.gas-form-section', elemId).each(function () {
        d.push({
          title: $('input[name$=-title]', this).val(),
          content: tinyMCE
            .get($('.gas-form-tinymce', this).attr('id'))
            .getContent(),
        });
      });
      const o = {
        author: 'GA user',
        title: $('[name=guide-title]', elemId).val(),
        description: $('[name=guide-description]', elemId).val(),
        sections: d,
      };
      let c = 'POST';
      let l = `https://${apiDomain}/api/guide`;
      if (isEditing)
        (l += `/${guideId}`),
          (c = 'PUT'),
          (o.author = guideFetchedData.author),
          (o.profileId = guideFetchedData.profileId);
      else {
        if (!userProfileData)
          return (
            t.show(),
            i.text(
              'Issue on accessing your data for saving. Please try again later.'
            ),
            $(`${elemId}-btn-submit`).val(e),
            void setTimeout(() => {
              t.hide(), i.text(a);
            }, 4e3)
          );
        (o.profileId = userProfileData.id),
          (o.author = userProfileData.name),
          (o.achievementId = achievementId);
      }
      const r = await fetch(l, {
        method: c,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(o),
      });
      const m = await r.json();
      if (![200, 201].includes(r.status))
        return (
          t.show(),
          i.text(m?.message),
          $(`${elemId}-btn-submit`)
            .val(e)
            .removeClass('disabled-button')
            .attr('disabled', !1),
          void setTimeout(() => {
            t.hide(), i.text(a);
          }, 4e3)
        );
      n.show(),
        $(`${elemId}-btn-submit`).val(e),
        setTimeout(() => {
          $(`${elemId}-fields`).hide();
        }, 800),
        setTimeout(() => {
          (isUserInputActive = !1), n.hide(), redirectAway();
        }, 4e3);
    });
}
function detailsResponseHandler(e, t = '#gas-guide-details') {
  const i = $(t);
  let a = i.prop('outerHTML');
  const n = [
    'id',
    'name',
    'achievementId',
    'achievementName',
    'gameId',
    'gameName',
  ];
  const s = e.coverURL || e.imageURL;
  s?.length &&
    t.endsWith('details') &&
    (a = i
      .css(
        'background-image',
        `linear-gradient(rgba(255,255,255,0),#030922),\n          linear-gradient(rgba(70,89,255,.4),rgba(70,89,255,.4)),\n          url(${s})`
      )
      .prop('outerHTML')),
    Object.entries(e).forEach(([e, t]) => {
      'achievementName' === e
        ? (a = a.replaceAll(`{|${e}|}`, achievementNameSlicer(t)))
        : n.includes(e) &&
          (a = a.replaceAll(
            `{|${e}|}`,
            (e.endsWith('At') ? gaDate(t) : t) || ''
          ));
    }),
    i.prop('outerHTML', a);
}
async function fetchGuide() {
  const e = await fetch(`https://${apiDomain}/api/guide/${guideId}`);
  (guideFetchedData = await e.json()),
    Object.keys(guideFetchedData).length > 0 &&
      guideFetchedData.id &&
      ((document.title = `${
        guideFetchedData.name?.length
          ? guideFetchedData.name
          : guideFetchedData.id
      } | ${document.title}`),
      detailsResponseHandler(guideFetchedData),
      detailsResponseHandler(guideFetchedData, '#gas-guide-form'));
}
async function fetchAchievement() {
  const e = await fetch(
    `https://${apiDomain}/api/achievement/${achievementId}`
  );
  const t = await e.json();
  Object.keys(t).length > 0 &&
    t.id &&
    ((document.title = `Achievement ${t.name?.length ? t.name : t.id} | ${
      document.title
    }`),
    (t.achievementName = t.name),
    detailsResponseHandler(t),
    detailsResponseHandler(t, '#gas-guide-form'));
}
function redirectAway() {
  window.location.replace(
    isEditing
      ? `/guide?id=${guideId}`
      : achievementId > 0
      ? `/achievement?id=${achievementId}`
      : '/guides'
  );
}
$().ready(async () => {
  if ((await auth0Bootstrap(), token)) {
    if (isEditing) {
      if ((await fetchGuide(), guideFetchedData?.achievementId > 0)) {
        const e = await fetch(
          `https://${apiDomain}/api/achievement/${guideFetchedData.achievementId}/guide-auth-user-data`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (200 !== e.status) return void redirectAway();
        if (!(await e.json()).ownedGuideId) return void redirectAway();
      }
    } else {
      if (!(achievementId > 0)) return void redirectAway();
      await fetchAchievement();
    }
    await setupForm(),
      $('.ga-loader-container').hide(),
      $('#ga-sections-container').show();
  } else redirectAway();
});
