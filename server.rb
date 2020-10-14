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
    response = HTTParty.get("https://api.github.com/users/#{params['name']}/repos")
    return response.body.to_json
  end

  get '/api/github/:name/:repo/forks' do
    response = HTTParty.get("https://api.github.com/repos/#{params['name']}/#{params['repo']}/forks")
    return response.body.to_json
  end
end
