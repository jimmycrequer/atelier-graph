# Atelier Graph

Tool to help alchemy optimization for the game Atelier Escha & Logy, built with Vue.js and Neo4j.

> Currently, only Japanese data is available!

## Background

Atelier's games have a complex alchemy system. This project only covers one aspect of the problem, being properties inheritance and properties combination optimization.

- Each resource/item belongs to one or more categories
  - Ice Bomb is a Bomb
  - Aqua Talisman is a Jewel and an Accessory
- In order to craft an item, you need to provide two or more ingredients
  - Bomb needs Fuel, Gunpowder and Paper ingredients
  - Purifying Liquid needs Liquid, Medical, Fuel and Synthesis ingredients.
- Resources and items can have at most 3 properties, which can be transmitted when used as ingredient for another craft
  - Healing Salve can have Effect Up, Heals Wounds, Fixed Healing
- Resources have restrictions regarding properties inheritance
  - Healing items cannot have Destruction Up (Increases effect of attack items by 10%) property
  - Similarly, bombs cannot have Healing Up (Increases effect of healing items by 10%) property
- It is possible to unlock more powerful properties by combining specific ones
  - Destruction Up+ (+20%) and Destruction Up++ (+30%) combines to form Intense Blast (+50%)
- Some powerful properties needs more than 10 other properties

The goal is to combine appropriate resources/items with specific properties in order to unlock more powerful ones.

## Features

### Properties Explorer

Choose properties and candidates materials will be shown.

![explorer-1](https://github.com/jimmycrequer/atelier-graph/blob/master/public/explorer-1.png)



Materials list include the item's categories and recipe (if any), so the user can find combinations.
This process is hard to automate because it also depends on your items inventory.

![explorer-2](https://github.com/jimmycrequer/atelier-graph/blob/master/public/explorer-2?raw=true)

[TODO] You can choose properties...


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

## Miscellaneous

-- cypher queries --
