function setDocumentLanguage(userLang) {
  document.documentElement.lang = userLang;
}

function setTextDirection(userLang) {
  const rtlLanguages = ["ar", "he", "fa", "ur"]; // Arabisch, Hebräisch, Persisch, Urdu

  const htmlElement = document.documentElement;
  if (rtlLanguages.includes(userLang)) {
    htmlElement.dir = "rtl";
  } else {
    htmlElement.dir = "ltr";
  }
}

function updateLanguageSettings() {
  const userLang = navigator.language || navigator.languages[0];

  // Sprache im HTML-Tag setzen
  setDocumentLanguage(userLang);
  // Ändern der Schreibrichtung je nach bevorzugter Schriftkultur
  setTextDirection(userLang);
}

document.addEventListener("DOMContentLoaded", () => {
  updateLanguageSettings();
});
