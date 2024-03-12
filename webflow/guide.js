import { loadComments } from '../wrappers/GuidePage/CommentsSection';
import { fetchGuide } from '../wrappers/GuidePage/GuideData';
import { verifyAuthenticatedUserGuideData } from '../wrappers/GuidePage/VerifyAuthUserGuideData';
import { showImageFromSrc, gaDateTime } from '../utils';

const apiDomain = document.querySelector('meta[name=domain]')?.content;
const urlParams = new URLSearchParams(location.search);
const guideId = urlParams.get('id') || 1;
const elemIdPrefix = `#gas-guide`;

$('.ga-loader-container').show();
$('#ga-sections-container').hide();

$(async () => {
  await auth0Bootstrap();
  if (await fetchGuide(apiDomain, guideId)) {
    await verifyAuthenticatedUserGuideData();
    await loadComments(apiDomain, guideId);
    $('.ga-loader-container').hide();
    $('#ga-sections-container').show();
    $('#gas-wf-tab-activator').click();
    return;
  }
  location.replace('/guides');
});
