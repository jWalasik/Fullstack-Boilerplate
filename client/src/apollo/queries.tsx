// Imports: Apollo
import { gql } from 'apollo-boost';

// Apollo: Queries
const checkAuth = gql`
  query IsUserLoggedIn {
    isAuth @client
  }
`

const authFacebook = gql`
  authFacebook(
    input: {
      accessToken: "EAACq2qsHMfQBAIvm0cuSZCkHZCuHsQZC674l7ZA03G87iFRbdqp2efT094LjU3OCZBgOJaK9ZCR6zi5WE9zsRT9Wl6Fyxum4APnrI5C8p3RJXzWbZBNQeZBhudb7RcD0ZCIjqVjKj1GH6btKep16aGf3dWLalGii9X8apXyZCcV90dUndXSgpZB6apQ8aW9IkYZBNregZArgomkNw3D3BfqjOdKUf"
    }
  )
`;

const authGoogle = gql`
  authGoogle(
    input: {
      accessToken: "EAACq2qsHMfQBAIvm0cuSZCkHZCuHsQZC674l7ZA03G87iFRbdqp2efT094LjU3OCZBgOJaK9ZCR6zi5WE9zsRT9Wl6Fyxum4APnrI5C8p3RJXzWbZBNQeZBhudb7RcD0ZCIjqVjKj1GH6btKep16aGf3dWLalGii9X8apXyZCcV90dUndXSgpZB6apQ8aW9IkYZBNregZArgomkNw3D3BfqjOdKUf"
    }
  )
`;

const login = gql`
  login(email: "jacekwalasik89@gmail.com", password: "xqwzts")
`;

const signup = gql`
  signup(email: "jacekwalasik89@gmail.com", password: "xqwzts")
`;

// Exports
export {
  checkAuth,
  authFacebook,
  authGoogle,
  signup,
  login,
};
