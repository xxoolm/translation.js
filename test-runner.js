const jasmine = new (require('jasmine'))()
jasmine.loadConfig({
  spec_dir: 'tests',
  spec_files: [
    '**/*-spec.js'
  ],
  helpers: []
})
jasmine.execute()
