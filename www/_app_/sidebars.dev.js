const sidebarsAuto = require("./sidebars.dev.auto");

module.exports = {
  dev: [
    ...sidebarsAuto.docs
    .map((doc) => {
      if (doc && doc === "README") {
        return null;
      }
      if (doc && doc.label === "assets") {
        return null;
      }
      return doc;
    })
    .filter((doc) => doc != null),
  ],
};
