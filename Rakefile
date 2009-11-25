# Assuming the jstdutil gem is installed, and JSTESTDRIVER_HOME is set.
namespace :test do
  task :server do
    exec "jstestdriver --port 4224"
  end
  
  task :run do
    # hmm
  end
  
  task :autotest do
    exec "jsautotest --config test/jsTestDriver.conf"
  end
end