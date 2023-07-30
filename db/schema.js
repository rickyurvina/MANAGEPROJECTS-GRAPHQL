const { ApolloServer, gql } = require('apollo-server')


const typeDefs = gql`

    type Token {
        token: String
    }

    type Project {
        name: String
        id: ID
    }

    type Task {
        name: String
        id: ID
        project: String
        state: Boolean 
    }

    type Query {
        getProjects : [Project]
        getTasks(input: ProjectIdInput) : [Task]
    }

    input ProjectIdInput {
        project: String!
    }

    input UserInput {
        name: String!
        email: String!
        password: String!
    }
    input AuthenticInput {
        email: String!
        password: String!
    }
    
    input ProjectInput {
        name: String!
    }

    input TaskInput {
        name: String!
        project: String
    }

    type Mutation {
        createUser(input: UserInput): String
        authenticateUser(input: AuthenticInput): Token
        newProject(input: ProjectInput): Project
        updateProject(id: ID!, input: ProjectInput): Project
        deleteProject(id: ID!): String

        newTask(input: TaskInput) : Task
        updateTask(id: ID!, input: TaskInput, state: Boolean ) : Task
        deleteTask(id: ID!) : String
    }
`;

module.exports = typeDefs;
