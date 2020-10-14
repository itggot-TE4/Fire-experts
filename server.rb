# frozen_string_literal: true

require 'dotenv'
require 'sinatra'
require 'httparty'

Dotenv.load

# Webserver handler
class Server < Sinatra::Base
  get '/api/github/:name/repos' do
    response = HTTParty.get("https://api.github.com/users/#{params['name']}/repos")
    return response.body.to_json

  # Serves the page
  get '/' do
    return File.read('./public/index.html')
  end

  get 'api/github/:name/:repo' do
    return [
      {
        "id": 303856514,
        "node_id": "MDEwOlJlcG9zaXRvcnkzMDM4NTY1MTQ=",
        "name": "ruby",
        "full_name": "Jema59/ruby",
        "private": false,
        "owner": {
          "login": "Jema59",
          "id": 71996863,
          "node_id": "MDQ6VXNlcjcxOTk2ODYz",
          "avatar_url": "https://avatars3.githubusercontent.com/u/71996863?v=4",
          "gravatar_id": "",
          "url": "https://api.github.com/users/Jema59",
          "html_url": "https://github.com/Jema59",
          "followers_url": "https://api.github.com/users/Jema59/followers",
          "following_url": "https://api.github.com/users/Jema59/following{/other_user}",
          "gists_url": "https://api.github.com/users/Jema59/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/Jema59/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/Jema59/subscriptions",
          "organizations_url": "https://api.github.com/users/Jema59/orgs",
          "repos_url": "https://api.github.com/users/Jema59/repos",
          "events_url": "https://api.github.com/users/Jema59/events{/privacy}",
          "received_events_url": "https://api.github.com/users/Jema59/received_events",
          "type": "User",
          "site_admin": false
        },
        "html_url": "https://github.com/Jema59/ruby",
        "description": "The Ruby Programming Language [mirror]",
        "fork": true,
        "url": "https://api.github.com/repos/Jema59/ruby",
        "forks_url": "https://api.github.com/repos/Jema59/ruby/forks",
        "keys_url": "https://api.github.com/repos/Jema59/ruby/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/Jema59/ruby/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/Jema59/ruby/teams",
        "hooks_url": "https://api.github.com/repos/Jema59/ruby/hooks",
        "issue_events_url": "https://api.github.com/repos/Jema59/ruby/issues/events{/number}",
        "events_url": "https://api.github.com/repos/Jema59/ruby/events",
        "assignees_url": "https://api.github.com/repos/Jema59/ruby/assignees{/user}",
        "branches_url": "https://api.github.com/repos/Jema59/ruby/branches{/branch}",
        "tags_url": "https://api.github.com/repos/Jema59/ruby/tags",
        "blobs_url": "https://api.github.com/repos/Jema59/ruby/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/Jema59/ruby/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/Jema59/ruby/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/Jema59/ruby/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/Jema59/ruby/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/Jema59/ruby/languages",
        "stargazers_url": "https://api.github.com/repos/Jema59/ruby/stargazers",
        "contributors_url": "https://api.github.com/repos/Jema59/ruby/contributors",
        "subscribers_url": "https://api.github.com/repos/Jema59/ruby/subscribers",
        "subscription_url": "https://api.github.com/repos/Jema59/ruby/subscription",
        "commits_url": "https://api.github.com/repos/Jema59/ruby/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/Jema59/ruby/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/Jema59/ruby/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/Jema59/ruby/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/Jema59/ruby/contents/{+path}",
        "compare_url": "https://api.github.com/repos/Jema59/ruby/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/Jema59/ruby/merges",
        "archive_url": "https://api.github.com/repos/Jema59/ruby/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/Jema59/ruby/downloads",
        "issues_url": "https://api.github.com/repos/Jema59/ruby/issues{/number}",
        "pulls_url": "https://api.github.com/repos/Jema59/ruby/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/Jema59/ruby/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/Jema59/ruby/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/Jema59/ruby/labels{/name}",
        "releases_url": "https://api.github.com/repos/Jema59/ruby/releases{/id}",
        "deployments_url": "https://api.github.com/repos/Jema59/ruby/deployments",
        "created_at": "2020-10-13T23:59:04Z",
        "updated_at": "2020-10-13T23:59:09Z",
        "pushed_at": "2020-10-13T18:18:25Z",
        "git_url": "git://github.com/Jema59/ruby.git",
        "ssh_url": "git@github.com:Jema59/ruby.git",
        "clone_url": "https://github.com/Jema59/ruby.git",
        "svn_url": "https://github.com/Jema59/ruby",
        "homepage": "https://www.ruby-lang.org/",
        "size": 231074,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": nil,
        "has_issues": false,
        "has_projects": true,
        "has_downloads": false,
        "has_wiki": false,
        "has_pages": false,
        "forks_count": 0,
        "mirror_url": nil,
        "archived": false,
        "disabled": false,
        "open_issues_count": 0,
        "license": {
          "key": "other",
          "name": "Other",
          "spdx_id": "NOASSERTION",
          "url": nil,
          "node_id": "MDc6TGljZW5zZTA="
        },
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master"
      }
    ].to_json
  end

  get 'api/github/:name/:repo/forks' do
    response = HTTParty.get("https://api.github.com/repos/#{params['name']}/#{params['repo']}/forks")
    return response.body.to_json
  end
end
