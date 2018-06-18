module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "linebreak-style": ["off"],
    "no-undef": ["error"],
    "no-underscore-dangle": ["error", {
      "allowAfterThis": true,
      "allow": ["_id"]
    }],
    "camelcase": ["error", { "properties": "always" }],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }]
  },
  "globals": {
    "it": 0,
    "expect": 0,
    "describe": 0,
  }
};