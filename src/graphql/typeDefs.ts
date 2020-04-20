import { gql } from 'apollo-server';

const typeDefs = gql`
  type UserMe {
    id: ID!
    email: String!
    username: String!
  }

  type UserLoginPayload {
    jwt: String!
    user: UserMe!
  }

  type Query {
    me: UserMe
  }

  type Mutation {
    register(email: String!, username: String!, password: String!): UserLoginPayload
    login(username: String!, password: String!): UserLoginPayload
  }
`;

export default typeDefs;