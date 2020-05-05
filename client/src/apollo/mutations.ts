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
      accessToken
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
      String
    }
  }
`

export const NEW_PASSWORD = gql`
  mutation newPassword($newPassword: String!, $resetToken: String!){
    newPassword(newPassword: $newPassword, resetToken: $resetToken) {
      String
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email){
      String
    }
  }
`

export const FACEBOOK_SIGN_IN = gql`
  mutation facebookSignIn($code: String!) {
    facebookSignIn(code: $code) {
      email
      name
      facebook
      isActive
      accessToken
    }
  }
`

export const REFRESH_TOKEN = gql`
  mutation refreshToken {
    refreshToken {
      email
      name
      accessToken
    }
  }
`