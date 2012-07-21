APPNAME = 'dashboard'

require 'colored'
require 'rake-pipeline'

def pipeline
  Rake::Pipeline::Project.new('Assetfile')
end

desc "Clean #{APPNAME}"
task :clean do
  pipeline.clean
end

desc "Build #{APPNAME}"
task :build => :clean do
  pipeline.invoke
end

desc "Run tests with PhantomJS"
task :test => :build do
  unless system("which phantomjs > /dev/null 2>&1")
    abort "PhantomJS is not installed. Download from http://phantomjs.org/"
  end

  cmd = "phantomjs tests/run-tests.js \"file://#{File.dirname(__FILE__)}/tests/index.html\""

  # Run the tests
  puts "Running #{APPNAME} tests"
  success = system(cmd)

  if success
    puts "Tests Passed".green
  else
    puts "Tests Failed".red
    exit(1)
  end
end

desc "deploy app"
task :deploy => :build do
  origin = `git config remote.origin.url`.chomp
  username = `git config user.name`.chomp
  cd "assets" do
    system "rm -rf .git"
    system "git init"
    system "git remote add origin #{origin}"
    system "git checkout -b gh-pages"
    system "git add ."
    puts "\n## Commiting: Site updated at #{Time.now.utc}"
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m \"#{message}\""
    puts "\n## Pushing generated website"
    system "git push origin gh-pages --force"
    puts "\n## Github Pages deploy complete -- http://#{username}.github.com/dashboard"
  end
end
