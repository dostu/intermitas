#!/usr/bin/env ruby

require 'json'
require 'neatjson'

FRAMES = 8
layer = '1'

paths = {}

FRAMES.times do |frame|
  groups = {}
  points = {}
  nodes = {}

  File.readlines("#{ frame + 1 }.html").each_cons(2) do |lines|
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

  points.each do |layer, points|
    links = points.map do |group|
      point_1 = nodes[layer].find_index(group[0])
      point_2 = nodes[layer].find_index(group[1])
      [point_1, point_2]
    end

    paths[layer][:links] = links
  end
end

paths = paths.values

File.open("js/data.js", 'w') do |file| 
  file.write('var sections = ')
  file.puts(JSON.neat_generate(paths, wrap: 300)) 
  file.write(';')
end
