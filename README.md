# Atelier Graph

Tool to help alchemy optimization for the game Atelier Escha & Logy, built with Vue.js and Neo4j.

**Currently, only Japanese data is available, sorry!**

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

![explorer-2](https://github.com/jimmycrequer/atelier-graph/blob/master/public/explorer-2.png)

You can choose properties through the designated modal window. Properties filtering on name, description is available, as well as compability (items supporting this property).

![explorer-3](https://github.com/jimmycrequer/atelier-graph/blob/master/public/explorer-3.png)

Cluster means the number of related properties. Cluster size can imply the following
- 3 and 6 are standard, it often means 2-1 and 3-2-1 combination, by using the correct ingredients it is possible to combine them all in one step
- 13 means a lot of properties needs to be used, requiring multiple steps, but the effect is more powerful than the previous one
- 1 mean that this property is not a combined one and might need to be found on rare resources or items

### Crafts Library

The dataset contains information about resources/items and the properties they have by nature, but once you start crafting your own items and using property inheritance, you are changing the dataset. Indeed, those items can be used for another craft, and property inheritance will also work, which means that a static dataset will not be useful for a long time. In the Crafts Library, you can manage custom properties relations, and make the dataset evolve.

![library-1](https://github.com/jimmycrequer/atelier-graph/blob/master/public/library-1.png)

Properties shown may not linked to that item initially, but those new relationships will be taking into account when searching materials in the Properties Explorer, enabling further optimization.
When you use an item to make another, you will lose it so showing ingredients is a valuable information in case you want to make that item again.

You can add a new craft through the designated modal.

![library-2](https://github.com/jimmycrequer/atelier-graph/blob/master/public/library-2.png)

## Limitations

At this stage of the development, this app only provide candidates for crafting, so you still needs to crap your head to find the appropriate ones.

Also, only Japanese data is available now, I will try to add English in near future.

## Setup

Specify your Neo4j instance host and credentials in the `.env` file.

```
VUE_APP_NEO4J_HOST=localhost
VUE_APP_NEO4J_USER=neo4j
VUE_APP_NEO4J_PWD=letmein
```

Run the scripts to import the data

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

For more options, please refer to the [vue-cli documentation](https://cli.vuejs.org/).

## Neo4j DB

DB schema.

![db-schema](https://github.com/jimmycrequer/atelier-graph/blob/master/public/db-schema.png)

Example of Property hierarchy.

```
MATCH (p)-[r:TO*0..]->(pp {name: "究極の破壊力"})
RETURN p
```

![db-properties](https://github.com/jimmycrequer/atelier-graph/blob/master/public/db-properties.png)

Example of Item and its relationships, including custom craft.

```
MATCH (i:Item {name: "魔法の繊維"})-[r]-(n)
RETURN *
```

![db-relationships](https://github.com/jimmycrequer/atelier-graph/blob/master/public/db-relationships.png)
