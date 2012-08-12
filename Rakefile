APPNAME = 'dashboard'

require 'colored'
require 'rake-pipeline'
require 'versionomy'
require 'rack'

def pipeline
  Rake::Pipeline::Project.new('Assetfile')
end

def version
  File.read("VERSION").strip
end

desc "Clean #{APPNAME}"
task :clean do
  pipeline.clean
end

desc "Build #{APPNAME}"
task :build => :clean do
  pipeline.invoke
end

def download(path)
  last_slash = path.rindex("/")
  system "mkdir -p app/tests/mock_response_data/#{path[0..last_slash]}"
  system "wget https://api.github.com/#{path} -O app/tests/mock_response_data/#{path}.json"
end

def download_event(url, page = 1)
  folder = "app/tests/mock_response_data/#{url}"
  system "mkdir -p #{folder}"
  Dir.chdir folder do
    system "wget https://api.github.com/#{url}?page=#{page}"
  end
end

def download_user_event(user, page = 1)
  download_event("users/#{user}/events", page)
end

def download_repo_event(user, repo, page = 1)
  download_event("repos/#{user}/#{repo}/events", page)
end

task :download_mock_responses do
  download "users/pangratz"
  download "users/nokinen"

  download "users/pangratz/repos"
  download "users/nokinen/repos"

  (1..10).each {|page| download_user_event("pangratz", page)}
  (1..10).each {|page| download_user_event("nokinen", page)}

  download "repos/pangratz/ember.js"
  download "repos/pangratz/dashboard"
  download "repos/nokinen/fdc"

  (1..10).each {|page| download_repo_event("pangratz", "ember.js", page)}
  (1..10).each {|page| download_repo_event("pangratz", "dashboard", page)}
  (1..10).each {|page| download_repo_event("nokinen", "fdc", page)}
end

task :test => ["test:all"]
namespace :test do
  task :all => [:unit, :functional]

  desc "Run casper.js tests"
  task :functional do
    ENV["TEST_MODE"] = "functional"
    Rake::Task["build"].invoke

    unless system("which casperjs > /dev/null 2>&1")
      abort "Casper.js is not installed. Download from http://casperjs.org/"
    end

    puts "start Rack server"
    pid = Thread.new do
      server = Rack::Server.new({
        :config => "config.ru",
        :Port => 9292,
        :Logger => nil
      })
      server.start
    end

    puts "Running #{APPNAME} Casper.js tests"
    success = system("casperjs test app/tests/functional/")

    pid.kill

    if success
      puts "Tests Passed".green
    else
      puts "Tests Failed".red
      exit(1)
    end
  end

  desc "Run Unit and Integration test"
  task :unit => :build do
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
end

desc "Bumps current version"
task :bump_version do
  next_version = Versionomy.parse(version).bump(:tiny)

  print "Enter next version (#{next_version}): "
  user_input = STDIN.gets.chomp
  next_version = user_input unless user_input.empty?

  File.open('VERSION', 'w') { |f| f.write( next_version ) }
  system "git commit VERSION -m 'Bump to new version #{next_version}'"
end

desc "Tag current code with current version"
task :release => :deploy do
  system "git tag -a v#{version}"
  system "git push --tag"

  Rake::Task["bump_version"].invoke
end

desc "deploy app"
task :deploy => :clean do
  FileUtils.rm_rf "assets"

  ENV['RAKEP_MODE'] = "production"
  Rake::Task["build"].invoke

  origin = `git config remote.origin.url`.chomp
  username = `git config user.name`.chomp
  cd "assets" do
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

namespace :upgrade do
  def download_ember(repo_name, source = repo_name, target = source)
    FileUtils.rm_rf "tmp/#{repo_name}"
    `git clone https://github.com/emberjs/#{repo_name} tmp/#{repo_name}`
    Dir.chdir("tmp/#{repo_name}") do
      `bundle install`
      `rake dist`
    end
    FileUtils.copy "tmp/#{repo_name}/dist/#{source}", "app/vendor/#{target}"
    FileUtils.rm_rf "tmp/#{repo_name}"
  end
  
  task :ember do
    download_ember("ember.js")
  end

  task :data do
    download_ember("data", "ember-data.js")
  end

  task :qunit do
    FileUtils.rm_rf "tmp/qunit"
    `git clone https://github.com/jquery/qunit tmp/qunit`
    Dir.chdir("tmp/qunit") do
      latest_tag = `git describe --abbrev=0 --tags`
      system "git checkout #{latest_tag}"
    end
    FileUtils.cp_r "tmp/qunit/qunit/.", "tests/qunit"
    FileUtils.rm_rf "tmp/qunit"
  end

  task :all => [:ember, :data, :qunit]
end

task :upgrade => ["upgrade:all"]
