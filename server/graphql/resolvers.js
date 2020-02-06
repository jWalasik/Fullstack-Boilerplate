// Imports: Dependencies
import axios from 'axios';

// GraphQL: Resolvers
const RESOLVERS = {
  Query: {
    findUser: (parent, args) => {
      return axios.get('')
        .then(response => response.data)
        .catch(error => console.log(error));
    },
  },

  Mutation: {
    addUser: (parent, args) => {
      return axios.get('')
        .then(response => response.data)
        .catch(error => console.log(error));
    },
    deleteUser: (parent, args) => {
      return axios.get('')
        .then(response => response.data)
        .catch(error => console.log(error));
    },
    updateUser: (parent, args) => {
      return axios.get('')
        .then(response => response.data)
        .catch(error => console.log(error));
    },
  },
};

// Exports
export default RESOLVERS;