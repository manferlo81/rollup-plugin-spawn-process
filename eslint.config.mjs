import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const eslintRules = normalizeRules({
  'no-useless-rename': 'error',
  'object-shorthand': 'error',
  'prefer-template': 'error',
  'no-useless-concat': 'error',
});

const stylisticRules = normalizeRules('@stylistic', {
  quotes: 'single',
  'linebreak-style': 'windows',
  'padded-blocks': 'off',
});

const typescriptRules = normalizeRules('@typescript-eslint', {
  'array-type': {
    default: 'array-simple',
    readonly: 'array-simple',
  },
});

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

const stylisticPluginConfig = stylistic.configs.customize({
  semi: true,
  arrowParens: true,
  quoteProps: 'as-needed',
  braceStyle: '1tbs',
});

const typescriptPluginConfig = config(
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,cjs,mjs}'], ...typescriptConfigs.disableTypeChecked },
);

export default config(
  { files: ['**/*.{js,cjs,mjs,ts}'] },
  { ignores: ['dist', 'coverage'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  stylisticPluginConfig,
  ...typescriptPluginConfig,
  { rules: { ...eslintRules, ...stylisticRules, ...typescriptRules, ...rulesToFix } },
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry) || ['error', 'warn', 'off'].includes(entry)) return entry;
  return ['error', entry];
}

function normalizeRulesObject(rules, pluginName) {
  if (!pluginName) {
    return Object.fromEntries(
      Object.entries(rules).map(
        ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)],
      ),
    );
  }
  const pluginPrefix = `${pluginName}/`;
  const normalizeRuleName = (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
  return Object.fromEntries(
    Object.entries(rules).map(
      ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)],
    ),
  );
}

function normalizeRules(pluginOrRules, rules) {
  if (!rules) return normalizeRulesObject(pluginOrRules);
  return normalizeRulesObject(rules, pluginOrRules);
}
