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
      type
      text
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation changePassword($currentPass: String!, $newPass: String!) {
    changePassword(currentPass: $currentPass, newPass: $newPass) {
      type
      text
    }
  }
`

export const SET_PASSWORD = gql`
  mutation setPassword($newPassword: String!, $resetToken: String!){
    setPassword(newPassword: $newPassword, resetToken: $resetToken) {
      type
      text
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email) {
      type
      text
    }
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