# frozen_string_literal: true

# A base class for handling inputs and custom methods for converting lists
class Input
  # Public: turns an array containing values and array of keys into a hash
  #
  # array: the array containing values
  # array: the array containing keys
  #
  # Examples
  #
  # Input.array_to_hash(["string1", "string2"], ["key2", "key1"])
  #   #=> {"key2" => "string1", "key1" => "string2"}
  def self.array_to_hash(array, keys)
    # special case, 'id' is autogenerated by database
    keys.shift if keys[0] == 'id'

    hash = {}

    keys.each_with_index do |column, i|
      hash[column] = array[i]
    end

    hash
  end

  # Public: turns and array or hash-keys into a string for use in an sql statement
  #
  # list: the array or hash to be turned into a string
  #
  # Examples
  #
  # Input.list_to_string(["hello", "I", "am", "an", "example"])
  #   #=> "'hello', 'I', 'am', 'an', 'example'"
  def self.list_to_string(list)
    case list
    when Array
      # handle cases where an array containing an array has been input
      list_to_string_when_array(list)
    when Hash
      list_to_string_when_hash(list)
    end
  end
end

# Helper for list_to string
def list_to_string_when_array(list)
  output = ''
  list = list[0] if list[0].is_a? Array
  list.each_with_index do |element, i|
    output += "'#{element}'"
    next output += ', ' if list.length > i + 1
  end
  output
end

# Helper for list_to string
def list_to_string_when_hash(list)
  keys = list.keys
  array = []
  keys.each do |key|
    array << list[key]
  end
  list_to_string(array)
end

# A class for all methods that interact with the database
class DBhandler < Input
  @table_name = nil
  @column_names = nil

  # Public: checks if a databse is connected and connects one if false
  #
  # Examples
  #
  # DBhandler.connect
  #   #=> @db
  def self.connect
    @db ||= SQLite3::Database.new('db/db.db')
    @db.results_as_hash = true
    @db
  end

  # Public: gets values from database
  #
  # Examples
  #
  # DBhandler.get do {:columns => "*", :nondefault_table => "Example"}
  #   #=> all items in table "Example"
  def self.get
    connect

    input = yield

    input[:fragment] = '' if input[:fragment].nil?

    if input[:nondefault_table]

      @db.execute("SELECT #{input[:columns]} FROM #{input[:nondefault_table]} #{input[:fragment]}", input[:condition])

    else

      @db.execute("SELECT #{input[:columns]} FROM #{@table_name} #{input[:fragment]}", input[:condition])

    end
  end

  # Public: gets all values from a table
  #
  # Examples
  #
  # Class_inheriting_DBhandler.all do {} end
  #   #=> all the values in the database table corresponding to the class variable @table_name
  def self.all
    connect

    input = yield

    @db.execute("SELECT * FROM #{@table_name} #{input[:fragment]}", input[:condition])
  end

  # Public: gets all items from a table where a condition is fullfilled
  #
  # Examples
  #
  # Class_inheriting_DBhandler.all_where do
  #   {:where => "bananpaj", :condition => "god"}
  # end
  #   #=> all the values in the database table corresponding to the class variable @table_name where "banapaj" = "god"
  def self.all_where
    connect

    input = yield

    all { { fragment: "WHERE #{input[:where]} = ?", condition: input[:condition] } }
  end

  # Public: inserts a series of values into a database
  #
  # Examples
  #
  # Class_inheriting_DBhandler.insert do {:insertion => {"bananpaj" => "god"}} end
  #   #=> "god" has been inserted into column "bananpaj" on table @table_name
  def self.insert
    connect

    input = yield

    columns = Input.list_to_string(input[:insertion].keys)

    values = Input.list_to_string(input[:insertion])

    if !input[:nondefault_table].nil?

      @db.execute("INSERT INTO #{input[:nondefault_table]} (#{columns}) VALUES (#{values})")

    else

      @db.execute("INSERT INTO #{@table_name} (#{columns}) VALUES (#{values})")

    end
  end

  # Public: updates values in a database
  #
  # Examples
  #
  # Class_inheriting_DBhandler.update do
  #   {:columns => ["bananpaj", kanelbulle], :values => ["inte god", "god"], :where => "id", :condition => 1}
  # end
  #   #=> values in table @table_name where "id" = 1 in columns "bananpaj"
  #          "kanelbulle" have been updated to "inte god" and "god" respectively
  def self.update
    input = yield

    connect

    return unless input[:columns].length == input[:values].length

    input[:columns].each_with_index do |column, i|
      @db.execute("UPDATE #{@table_name}
                  SET #{column} = '#{input[:values][i]}'
                  WHERE #{input[:where]} = ? ",
                  input[:condition])
    end
  end

  # Public: checks if a username is unique
  #
  # Examples
  #
  # User.unique? do {:username => "not_unique_name"} end
  #   #=> false
  def self.unique?
    input = yield

    taken_names = get { { columns: 'full_name' } }

    taken_names.each do |name|
      return false if name['full_name'] == input[:full_name]
    end

    true
  end
end

# An end class which is used to call upon DBhandler methods from server.rb
class Fork < DBhandler
  @table_name = 'forks'

  @column_names = %w[full_name comment graded parent_repo]

  # Helper for save_comment
  def self.save_comment_insert(input)
    insert do
      { insertion: array_to_hash([input[:full_name],
                                  input[:comment],
                                  input[:graded],
                                  input[:parent_repo]],
                                 @column_names) }
    end
  end

  # Helper for save_comment
  def self.save_comment_update(input)
    update do
      { columns: %w[comment graded],
        values: [input[:comment], input[:graded]],
        where: 'full_name',
        condition: input[:full_name] }
    end
  end

  # Checks if there already is a comment for the given fork
  # creates a new comment or updates the existing one
  def self.save_comment
    input = yield
    if unique? { { full_name: input[:full_name] } }
      save_comment_insert(input)
    else
      save_comment_update(input)
    end
  end
end
