#!/usr/bin/env ruby

require 'json'
require 'neatjson'

FRAMES = 4
layer = '1'

paths = {}

FRAMES.times do |frame|
  groups = {}
  points = {}
  nodes = {}

  File.readlines("background/#{ frame + 1 }.html").each_cons(2) do |lines|
    layer = $1 if lines.first =~ /layer(\d)/
    groups[layer] ||= []
    groups[layer] << [lines.first, lines.last] if lines.last =~ /lineTo/
  end

  groups.each do |layer, groups|
    points[layer] = groups.map do |lines|
      lines.map do |line|
        if line =~ /\((.*), (.*)\)/
          x = ($1.to_f / 5).round * 5
          y = ($2.to_f / 5).round * 5
          [x, y] 
        end
      end end 
    nodes[layer] = points[layer].flatten(1).uniq
  end

  nodes.each do |layer, nodes|
    paths[layer] ||= {} 
    paths[layer][:nodes] ||= []
    paths[layer][:nodes] << nodes
  end
end

paths = paths.values

File.open("data/background_points.js", 'w') do |file| 
  file.write('var backgroundPoints = ')
  file.puts(JSON.neat_generate(paths, wrap: 300)) 
  file.write(';')
end
