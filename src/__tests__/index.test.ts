import gql from "../";

test("dedup GraphQL fragments", () => {
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

  expect(Query.loc!.source.body.trim()).toMatchInlineSnapshot(`
    "query User {
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
        }"
  `);
});
