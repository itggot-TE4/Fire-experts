# frozen_string_literal: true

require 'dotenv'
require 'sinatra'
require 'httparty'

Dotenv.load

# Webserver handler
class Server < Sinatra::Base
  # Serves the page
  get '/' do
    return File.read('./public/index.html')
  end

  get '/api/github/:name/repos' do
    call_gh_api("https://api.github.com/users/#{params['name']}/repos").body
  end

  get '/api/github/:name/:repo/forks' do
    call_gh_api("https://api.github.com/repos/#{params['name']}/" \
              "#{params['repo']}/forks").body
  end

  def call_gh_api(url)
    auth = {
      username: ENV['GH_USER_NAME'],
      token: ENV['GH_ACCESS_TOKEN']
    }
    options = { basic_auth: auth }
    HTTParty.get(url, options)
  end
end
