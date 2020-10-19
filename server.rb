# frozen_string_literal: true

require 'dotenv'
require 'sinatra'
require 'httparty'

Dotenv.load

# Webserver handler
class Server < Sinatra::Base
  enable :sessions

  # Serves the page
  get '/' do
    @client_id = ENV['GH_BASIC_CLIENT_ID']
    slim :index
  end

  get '/api/github/:name/repos' do
    call_gh_api("https://api.github.com/users/#{params['name']}/repos").body
  end

  get '/api/github/:name/:repo/forks' do
    call_gh_api("https://api.github.com/repos/#{params['name']}/" \
              "#{params['repo']}/forks").body
  end

  get '/api/github/user' do
    response = call_gh_api('https://api.github.com/user')
    if response.parsed_response == response.body
      session[:access_token] = nil
      return ''
    else
      response.body
    end
  end

  get '/callback' do
    begin
      # get temporary GitHub code...
      session_code = request.env['rack.request.query_hash']['code']
      # ... and POST it back to GitHub
      result = HTTParty.post('https://github.com/login/oauth/access_token',
                             { body:
                               { client_id: ENV['GH_BASIC_CLIENT_ID'],
                                 client_secret: ENV['GH_BASIC_SECRET_ID'],
                                 code: session_code },
                               headers: { accept: 'application/json' } })
      session[:access_token] = JSON.parse(result.body)['access_token']
    rescue StandardError
      session[:access_token] = nil
    ensure
      redirect '/'
    end
  end

  def call_gh_api(url)
    auth = "Bearer #{session[:access_token]}"
    HTTParty.get(url, headers: { 'Authorization' => auth })
  end

  def authorized?
    return if session[:access_token]
  end
end
