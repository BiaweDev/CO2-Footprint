function setDocumentLanguage(userLang) {
  document.documentElement.lang = userLang;
}

function setTextDirection() {
  const rtlLanguages = ["ar", "he", "fa", "ur"]; // Arabisch, Hebräisch, Persisch, Urdu

  const htmlElement = document.documentElement;
  if (rtlLanguages.includes(htmlElement.lang)) {
    htmlElement.dir = "rtl";
  } else {
    htmlElement.dir = "ltr";
  }
}

function updateLanguageSettings() {
  const userLang = navigator.language;

  // Sprache im HTML-Tag setzen
  setDocumentLanguage(userLang);
  // Ändern der Schreibrichtung je nach bevorzugter Schriftkultur
  setTextDirection();
}

document.addEventListener("DOMContentLoaded", () => {
  updateLanguageSettings();
});
