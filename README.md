# atelier-graph

## Import the data

```
LOAD CSV FROM "https://raw.githubusercontent.com/jimmycrequer/atelier-graph/master/items.csv" AS row

MERGE (i:Item {name: row[0]})

WITH i, row
UNWIND split(row[1], "|") AS category
MERGE (cat:Category {name: category})
MERGE (i)-[:IS]->(cat)

WITH i, row
UNWIND split(row[2], "|") AS recipe
MERGE (c {name: recipe})
MERGE (i)-[:NEEDS]->(c)
```

### OLD

```
LOAD CSV FROM "file:///materials-escha-and-logy.csv" AS row

MERGE (m:Material { name: row[0] })

WITH row, m
UNWIND split(row[1], "|") AS category
MERGE (c:Category {name: category})
MERGE (m)-[:IS]->(c)

WITH row, m
UNWIND split(row[2], "|") AS location
MERGE (l:Location {name: location})
MERGE (m)-[:LOCATED_IN]->(l)

WITH row, m
UNWIND split(row[3], "|") AS monster
MERGE (mo:Monster {name: monster})
MERGE (m)-[:DROP_FROM]->(mo)

RETURN *
```

## Queries

```
MATCH (n) WHERE not(exists((n)-[:NEEDS]->())) RETURN n.name
```