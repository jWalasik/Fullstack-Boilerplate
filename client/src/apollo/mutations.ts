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
  mutation changePassword($currentPass: String!, $newPass: String!) {
    changePassword(currentPass: $currentPass, newPass: $newPass)
  }
`

export const NEW_PASSWORD = gql`
  mutation newPassword($newPassword: String!, $resetToken: String!){
    newPassword(newPassword: $newPassword, resetToken: $resetToken)
  }
`

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`

export const GOOGLE_SIGN_IN = gql`
  mutation googleSignIn($code: String!) {
    googleSignIn(code: $code) {
      email
      name
      google
      isActive
      accessToken
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