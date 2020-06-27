# Atelier Graph

Tool to help alchemy optimization for the game Atelier Escha & Logy, built with Vue.js and Neo4j.

> Currently, only Japanese data is available!

## Background

Atelier's games have a complex alchemy system. This project only covers one aspect of the problem, being properties inheritance and properties combination optimization.

- Each resource/item belongs to one or more categories
  - exemple1
  - exemple2
- In order to craft an item, you need to provide two or more ingredients
  - exemple1
  - exemple2
- Resources and items have properties, which can be transmitted when used as ingredient for another craft
- Resources have restrictions regarding inheritance
- It is possible to unlock more powerful properties by combining specific ones
  - exemple1
  - exemple2
- Some powerful properties needs more than 10 other properties

The goal is to combine appropriate resources/items with specific properties in order to unlock more powerful ones.

## Features

### Alchemy Helper

### Crafts Library

## Limitations

At this stage of the development, this app only provide candidates for crafting, so you still needs to crap your head to find the appropriate ones.

## Setup

Specify your Neo4j instance host and credentials in the `.env` file.

```
VUE_APP_NEO4J_HOST=localhost
VUE_APP_NEO4J_USER=neo4j
VUE_APP_NEO4J_PWD=letmein
```

Run the scripts to import the data

> Currently, only Japanese data is available!

```
node scripts/recipes-jp.js
node scripts/properties-jp.js
```

## Usage

Download the dependencies

```
npm install
```


Run the App

```
npm run serve
```

For more options, please refer to the vue-cli documentation.
