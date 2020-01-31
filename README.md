# atelier-graph

## Import the data

### Materials

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
