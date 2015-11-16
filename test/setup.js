// we delete the cached require of '@gr2m/frontend-test-setup'
// to make it work with mocha --watch.
delete require.cache[require.resolve('@gr2m/frontend-test-setup')]
require('@gr2m/frontend-test-setup')
