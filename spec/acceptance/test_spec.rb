# frozen_string_literal: true

require_relative 'acceptance_helper'

class TeacherOMatic < Minitest::Spec
  include ::Capybara::DSL
  include ::Capybara::Minitest::Assertions

  def self.test_order
    :alpha # run the tests in this file in order
  end

  before do
    visit '/'
  end

  after do
    Capybara.reset_sessions!
  end

  it 'Has a header' do
    assert page.has_selector?('header')
  end

  it 'Has a form withing the header' do
    assert page.has_selector?('header form')
    assert page.has_selector?('header form input')
  end

  it 'Has a github login button' do
    assert page.has_selector? 'header a.github'
  end

  it 'Has welcome text' do
    assert page.has_content? 'Welcome to Teacher-O-Matic!'
    assert page.has_content? 'Sign-in using the GitHub button in the header field'
  end
end
