// from https://webflow.com/made-in-webflow/website/Rich-Text-Editor-For-WEBFLOW
// tinymce.init({
//     selector: '#tinymce',
//     menu: {
//         file: { title: 'File', items: 'newdocument' },
//         edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall' },
//         format: { title: 'Format', items: 'bold italic underline | removeformat' },
//         tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | wordcount' },
//     },
//     plugins: 'lists',
//     toolbar: [{ name: 'history', items: ['undo', 'redo'] }, { name: 'formatting', items: ['bold', 'italic', 'underline', 'numlist', 'bullist'] }],
//     toolbar_mode: 'floating'
// });
// <script src="https://cdn.tiny.cloud/1/sj801m9s9ivbndop77c87iww4n5onm4rvgcxo1a63ayhv32s/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

const urlParams = new URLSearchParams(window.location.search);
const guideId = urlParams.get("id");
const elemIdPrefix = `#gas-guide`;
//ids
// -details
// -form
const elemId = `${elemIdPrefix}-form`;

const tmceObj = {
  selector: ".gas-form-tinymce",
  height: 200,
  menubar: false,
  toolbar_mode: "floating",
  plugins: "link image lists",
  toolbar: "undo redo | bold italic underline | numlist bullist",
  content_style: "body { font-family:Gantari,sans-serif; font-size:1rem }",
};

// https://stackoverflow.com/a/14023897/6225838
//  // get the content of the active editor
//  alert(tinyMCE.activeEditor.getContent());
//  // get the content by id of a particular textarea
//  alert(tinyMCE.get('section-1-content').getContent());

const sectionsLimit = 4;
let sectionsCount = 2; // initial

function delSection() {
  if (
    confirm(
      "Press OK to confirm you want to remove this section and its content"
    )
  ) {
    $(this).parents(".gas-form-section").remove();
    sectionsCount--;
    if (sectionsCount <= sectionsLimit) {
      $(".gas-form-section-add", elemId).show();
    }
  }
}

window.onload = async () => {
  // clone the copyable section into a template
  const $sectionTemp = $(".gas-form-section", elemId).clone();
  $(".gas-form-tinymce", $sectionTemp).removeAttr("id");
  // only activate tinyMCE after copying
  tinymce.init(tmceObj);

  await auth0Bootstrap();
  if (userAuth0Data?.sub?.length) {
    token = await auth0Client.getTokenSilently();
  }
  if (guideId) {
    // TODO: load guide data into fields
  }

  $(".gas-form-section-add", elemId).click(function () {
    sectionsCount++;
    const newId = `section-${sectionsCount}-content`;
    const $newSection = $sectionTemp.clone().show();
    $(".gas-form-tinymce", $newSection).attr("id", newId).attr("name", newId);
    $(".gas-form-section-del", $newSection).click(delSection);
    $(".gas-form-sections", elemId).append($newSection);
    tmceObj.selector = `#${newId}`;
    tinymce.init(tmceObj);
    if (sectionsCount > sectionsLimit) {
      $(this).hide();
    }
  });

  $(".gas-form-section-del", elemId).click(delSection);

  $(".gas-form-cancel", elemId).click(function () {
    $(`${elemIdPrefix}-popup-leave`).show();
  });
};
