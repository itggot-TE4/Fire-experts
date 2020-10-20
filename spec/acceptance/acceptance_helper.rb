# frozen_string_literal: true

require 'capybara/minitest'
require 'capybara/minitest/spec'
require 'rack/test'

require_relative '../spec_helper'
require_relative '../../server'

Capybara.app = Server

Capybara.default_driver = :selenium_chrome_headless
Capybara.server = :webrick
