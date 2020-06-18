import {combineReducers} from 'redux'
import codeConsole from './codeConsole'
import charts from './charts'
import modal from './modal'
import dataset from './dataset'
import chartManipulations from './chartManipulations'
import tab from './tab'

export default combineReducers({
  codeConsole,
  charts,
  modal,
  dataset,
  chartManipulations,
  tab,
})
