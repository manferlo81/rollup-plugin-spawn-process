import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

// FIXME: Turn them on or move then to the correct place
const rulesToFix = {
  '@stylistic/multiline-ternary': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/non-nullable-type-assertion-style': 'off',
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/no-dynamic-delete': 'off',
  '@typescript-eslint/no-invalid-void-type': 'off',
};

const javascriptPluginConfig = config({
  extends: [pluginJs.configs.recommended],
  rules: normalizeRules({
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-useless-concat': 'error',
  }),
});

const stylisticPluginConfig = config({
  extends: [
    stylistic.configs.customize({
      semi: true,
      arrowParens: true,
      quoteProps: 'as-needed',
      braceStyle: '1tbs',
    }),
  ],
  rules: normalizeRules('@stylistic', {
    quotes: 'single',
    'linebreak-style': 'windows',
    'no-extra-parens': 'all',
    'no-extra-semi': 'error',
    'padded-blocks': 'off',
  }),
});

const typescriptPluginConfig = config(
  {
    extends: [
      typescriptConfigs.strictTypeChecked,
      typescriptConfigs.stylisticTypeChecked,
    ],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } },
    rules: normalizeRules('@typescript-eslint', {
      'array-type': {
        default: 'array-simple',
        readonly: 'array-simple',
      },
    }),
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    extends: [typescriptConfigs.disableTypeChecked],
  },
);

export default config(
  { files: ['**/*.{js,cjs,mjs,ts}'],
    ignores: ['dist', 'coverage'],
    languageOptions: { globals: globals.node },
  },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfig,
  { rules: rulesToFix },
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['error', 'warn', 'off'].includes(entry)) return entry;
  return ['error', entry];
}

function createPluginRuleNameNormalizer(pluginName) {
  const pluginPrefix = `${pluginName}/`;
  return (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
}

function createEntryNormalizer(pluginName) {
  if (!pluginName) return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  const normalizeRuleName = createPluginRuleNameNormalizer(pluginName);
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function normalizeRules(pluginName, rules) {
  if (!rules && pluginName) return normalizeRules(null, pluginName);
  const normalizeEntry = createEntryNormalizer(pluginName);
  return Object.fromEntries(Object.entries(rules).map(normalizeEntry));
}
