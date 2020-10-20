# frozen_string_literal: true

require 'dotenv'
require 'sinatra'
require 'httparty'

require_relative 'modules/dbhandler'

Dotenv.load

# Webserver handler
class Server < Sinatra::Base
  enable :sessions

  # Serves the page
  # Gets the index.html file and opens up our layout in the browser.
  get '/' do
    @client_id = ENV['GH_BASIC_CLIENT_ID']
    slim :index
  end
  # Calls the get route with your Username and token key,
  # then gets the name from the input field in the
  # headerfield and makes a request to the github api to find the repository
  get '/api/github/:name/repos' do
    call_gh_api("https://api.github.com/users/#{params['name']}/repos").body
  end
  # Calls the get route with your Username and token key,
  # then gets the name from the input field in the
  # headerfield and makes a request to the github api to find the repository,
  # and then looks for existing forks bounded to the github username.
  get '/api/github/:name/:repo/forks' do
    call_gh_api("https://api.github.com/repos/#{params['name']}/" \
              "#{params['repo']}/forks").body
  end
  # A get route that gets the users "github username" and then
  # uses it for the resquest to get
  # the repositorys from the "Username"
  get '/api/github/user' do
    response = call_gh_api('https://api.github.com/user')
    if response.parsed_response == response.body
      session[:access_token] = nil
      return ''
    else
      response.body
    end
  end
  # Handles githubs callback.
  get '/callback' do
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

  # Gets all comments for a specific GitHub repository
  # params['users'] is an unused input
  get '/api/comments/:user/:repo' do
    comments = Fork.all_where { { where: 'parent_repo', condition: params['repo'] } }
    return comments.to_json
  end

  # Updates or creates a comment on a given fork of a given GitHub repository
  patch '/api/update_comment/:name/:repo/:comment/:graded' do
    Fork.save_comment do
      { full_name: "#{params['name']}/#{params['repo']}",
        comment: params['comment'],
        graded: params['graded'].to_i,
        parent_repo: params['repo'] }
    end
  end

  # Gets all comments for a specific GitHub repository
  # params['users'] is an unused input
  get '/api/comments/:user/:repo' do

    comments = Fork.get_all_where do {:where => "parent_repo", :condition => params['repo']} end
    return comments.to_json

  end

  # Updates or creates a comment on a given fork of a given GitHub repository
  patch '/api/update_comment/:name/:repo/:comment/:graded' do

    Fork.save_comment do {:full_name => "#{params['name']}/#{params['repo']}", :comment => params['comment'], :graded => params['graded'].to_i, :parent_repo => params['repo']} end

  end

  # A function that gets and authorizes your username and key from the ENV file,
  # for using the github API, and it's using httpparty as fetching.
  def call_gh_api(url)
    auth = "Bearer #{session[:access_token]}"
    HTTParty.get(url, headers: { 'Authorization' => auth })
  end

  # A function that checks if the user is authorized.
  def authorized?
    return if session[:access_token]
  end
end
