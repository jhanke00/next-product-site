module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        ['build', 'ci', 'docs', 'feat', 'fix', 'chore', 'refactor', 'revert', 'style', 'perf', 'test'],
      ],
      'scope-case': [2, 'always', 'lower-case'],
      'subject-case': [2, 'always', 'lower-case'],
    },
  };