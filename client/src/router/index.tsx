import * as React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import AddRecipe from '../pages/AddRecipe'
import BrowseRecipe from '../pages/BrowseRecipes'
import Home from '../pages/Home'
import Planner from '../pages/Home'
import RequireAuth from './RequireAuth'
import Settings from '../pages/Settings'
import ShoppingList from '../pages/ShoppingList'
import Sign from '../pages/Sign'

export default () => {
  return (
  <BrowserRouter>
    <RequireAuth>
      <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/add-recipe" component={AddRecipe} />
      <Route exact path="/browse-recipes" component={BrowseRecipe} />
      <Route exact path="/meal-planner" component={Planner} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/shop-list" component={ShoppingList} />
      
    </Switch>
    </RequireAuth> 
    <Route path="/auth" component={Sign} />
  </BrowserRouter>
)}