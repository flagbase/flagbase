const sidebarsAuto = require("./sidebars.docs.auto");

module.exports = {
  docs: [
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
    {
      type: "link",
      href: "/docs/api",
      label: "API Docs",
    },
  ],
};
