// Imports: Dependencies
import { gql } from 'apollo-server-express';

// GraphQL: TypeDefs
const TYPEDEFS = gql`
  type Query {
    exampleQuery: exampleType1
  }
  type Mutation {
    exampleMutation: exampleType2
  }
  type exampleType1 {
    exampleField: String
  }
  type exampleType2 {
    exampleField: String
  }
`;

// Exports
export default TYPEDEFS;