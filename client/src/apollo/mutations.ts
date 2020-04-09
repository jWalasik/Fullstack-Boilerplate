import {gql} from 'apollo-boost'

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`

export const LOGIN = gql`
  mutation login($login: String!, $password: String!) {
    login(user: $login, password: $password) {
      email
      _id
      isActive
      token
    }
  }
`

export const SIGNUP = gql`
  mutation signup($name: String, $password: String!, $email: String!) {
    signup(email: $email, password: $password, name: $name) {
      email
      _id
      isActive
      token
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation changePassword($user: String!, $currentPass: String!, $newPass: String!) {
    changePassword(user: $user, currentPass: $currentPass, newPass: $newPass) {
      password
    }
  }
`

export const FACEBOOK_SIGN_IN = gql`
  mutation facebookSignIn($code: String!) {
    facebookSignIn(code: $code){
      user {
        id
        email
        name
      }
    }
  }
`