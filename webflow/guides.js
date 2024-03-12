import { fetchGuides } from '../wrappers/GuidesPage/GuidesData';
import { setupListSearch } from '../utils';

const elemId = '#gas-list-guides';

$(async () => {
  await auth0Bootstrap();
  setupListSearch(elemId, fetchGuides);
  await fetchGuides(elemId);
  $('.ga-loader-container').hide();
});
