# gql-dedup: a graphql-tag improvement library which de-duplicates fragments

Well-known Apollo's [graphql-tag](https://github.com/apollographql/graphql-tag)
library hasn't been updated for a long time, and there has been several PRs got
stuck there.

The current library solves one common weakness of graphql-tag: it allows to
refer fragments multiple times and have them de-duplicated in the query.

## Example

Imagine we have a common FragDate fragment which two other fragments,
FragCreated and FragUpdated, depend on. Then, with the default graphql-tag
library, using of **both** FragCreated and FragUpdated in the same query won't
be possible since FragDate would be included twice, and we'd get a server-side
error.

Here comes graphql-tag: it de-duplicates fragments each time they're used.

```ts
import gql from "gql-dedup";

const FragDate = gql`
  fragment FragDate on User {
    day
    month
    year
  }
`;

const FragCreated = gql`
  fragment FragCreated on User {
    created {
      ...FragDate
    }
  }
  ${FragDate}
`;

const FragUpdated = gql`
  fragment FragUpdated on User {
    updated {
      ...FragDate
    }
  }
  ${FragDate}
`;

const Query = gql`
  query User {
    viewer {
      ...FragCreated
      ...FragUpdated
    }
  }
  ${FragCreated}
  ${FragUpdated}
`;
```

Result (notice that FragDate is included only once):

```graphql
query User {
  viewer {
    ...FragCreated
    ...FragUpdated
  }
}
fragment FragCreated on User {
  created {
    ...FragDate
  }
}
fragment FragDate on User {
  day
  month
  year
}
fragment FragUpdated on User {
  updated {
    ...FragDate
  }
}
```
